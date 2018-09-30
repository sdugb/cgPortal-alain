import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { SettingsService } from '@delon/theme';
import { TeamService } from '../../function/team.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorage } from '../../../core/local.storage';

@Component({
    selector: 'app-pages-team',
    templateUrl: './team.component.html',
    providers: [TeamService, LocalStorage]
})

export class TeamComponent implements OnInit {
    validateForm: FormGroup;
    scaleList: any = [];
    name: String;
    alias: String;
    scale: String;
    host: String;
    apiUrl: String;
    WWWPort: String;
    sshPort: Number;
    sshUser: String;
    sshPassword: String;
    storageDir: String;

    current = 0;
    index = 'First-content';

    pre() {
        this.current -= 1;
        this.changeContent();
    }

    next() {
        this.current += 1;
        this.changeContent();
    }

    changeContent() {
        switch (this.current) {
            case 0: {
                this.index = 'First-content';
                break;
            }
            case 1: {
                this.index = 'Second-content';
                break;
            }
            case 2: {
                this.index = 'Third-content';
                break;
            }
            case 3: {
                this.index = 'Forth-content';
                break;
            }
            default: {
                this.index = 'error';
            }
        }
    }

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[ i ].markAsDirty();
        }
    }

    constructor(private fb: FormBuilder,
                private _teamService: TeamService,
                private msg: NzMessageService,
                private _localStorage: LocalStorage,
                private _router: Router) {

        this.scaleList = [
            { value: '1', label: '5-10人'},
            { value: '2', label: '10-30人'},
            { value: '3', label: '30人以上'}
        ];
    }

    updateConfirmValidator() {
        /** wait for refresh value */

    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        }
    }

    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            name             : [ 'newTeam', [ Validators.required ] ],
            alias            : [ '新世界团队' ],
            scale            : [ null ],
            host             : [ '211.87.224.230' ],
            WWWPort          : [ '6002' ],
            storageDir       : [ '/opt/dat/db' ],
            sshPort          : [ 77 ],
            sshUser          : [ 'cgteam' ],
            sshPassword      : [ 'cgt1234' ]
        });
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onCreateTeam() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        console.log(this.getFormControl('scale').value);
        const userName = currentUser.user.username;
        this.name = this.getFormControl('name').value;
        this.alias = this.getFormControl('alias').value;
        const scale = this.getFormControl('scale').value;
        this.host = this.getFormControl('host').value;
        this.WWWPort = this.getFormControl('WWWPort').value;
        this.storageDir = this.getFormControl('storageDir').value;
        this.sshPort = this.getFormControl('sshPort').value;
        this.sshUser = this.getFormControl('sshUser').value;
        this.sshPassword = this.getFormControl('sshPassword').value;
        this._teamService.createTeam({
            name: this.name, user: userName , alias: this.alias, scale: scale.value,
            host: this.host, WWWPort: this.WWWPort,  storageDir: this.storageDir,
            sshPort: this.sshPort, sshUser: this.sshUser, sshPassword: this.sshPassword }).subscribe(data => {
                this._router.navigate(['/function/myTeams']);
        });
    }

    onTest() {
        const host = this.getFormControl('host').value;
        const sshPort = this.getFormControl('sshPort').value;
        const sshUser = this.getFormControl('sshUser').value;
        const sshPassword = this.getFormControl('sshPassword').value;
        const storageDir = this.getFormControl('storageDir').value;

        this._teamService.testSSHServer(host, sshPort, sshUser, sshPassword).subscribe(data => {
            console.log('data =', data);
            /*
            if (user === data[0][2]) {
                this.msg.success('done');
            } else {
                //this.error = 'error';
            }
            */
        });
    }

    onCancel() {
        this._router.navigate(['function/myTeams']);
    }
}
