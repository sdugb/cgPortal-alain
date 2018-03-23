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
    templateUrl: './team.component.html'

})

export class TeamComponent implements OnInit {
    validateForm: FormGroup;
    scaleList: any = [];

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
            name             : [ null, [ Validators.required ] ],
            alias            : [ null ],
            url              : [ null ],
            scale            : [ null ]
        });
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onCreateTeam() {

        console.log(this.getFormControl('name').value);
        console.log(this.getFormControl('alias').value);
        console.log(this.getFormControl('url').value);
        console.log(this.getFormControl('scale').value);

        let userName = this._localStorage.getObject('username');
        let name = this.getFormControl('name').value;
        let alias = this.getFormControl('alias').value;
        let url = this.getFormControl('url').value;
        let scale = this.getFormControl('scale').value;

        this._teamService.createTeam({
            user: userName, name: name, alias: alias, url: url, scale: scale.value}).subscribe(data => {
            this._router.navigate(['/function/myTeams']);
        });

    }

    onCancel() {
        this._router.navigate(['function/myTeams']);
    }
}
