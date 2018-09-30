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
    selector: 'app-pages-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css'],
    providers: [TeamService, LocalStorage]
})

export class ProjectComponent implements OnInit {
    validateForm: FormGroup;
    userName: String;
    templateList: any = [];
    designToolList: any = [];
    renderList: any = [];
    timeUnitList: any = [];
    xResolution: number;
    yResolution: number;
    render: String;
    timeUnit: String;
    designTool: String;

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
        this.designToolList = ['maya2014', 'maya2015', 'maya2016', 'maya2017', 'maya2018', '3dsMax2012', '3dsMax2014', '3dsMax2016', '3dsMax2018'];
        this.renderList = ['arnold', 'redshift', 'Vray', 'mayaSoftware', 'mayaHardware'];

        this.timeUnitList = ['game: 15fps',
                            'film: 24fps',
                            'pal: 25fps',
                            'ntsc: 30fps',
                            'show: 48fps',
                            'palf: 50fpa',
                            'ntscf: 60fps'];
        this.designTool = 'maya2014'
        this.render = 'arnold';
        this.timeUnit = 'pal: 25fps';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/']);
            return;
        }
        this.userName = currentUser.user.username;
        this.xResolution = 1920;
        this.yResolution = 1280;
        this._teamService.getMyTemplates(this.userName).subscribe(data => {
            this.templateList = data;
        });
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
            designTool       : [ null ],
            render           : [ null ],
            timeUnit         : [ null ],
            xResolution      : [ null ],
            yResolution      : [ null ]
        });

    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onCreateProject() {
        const name = this.getFormControl('name').value;
        const alias = this.getFormControl('alias').value;
        const project = {name: name,
            user: this.userName,
            alias: alias,
            designTool: this.designTool,
            render: this.render,
            timeUnit: this.timeUnit,
            xResolution: this.xResolution,
            yResolution: this.yResolution};
        this._teamService.createProject(project).subscribe(data => {
            this._router.navigate(['function/myProjects']);
            this.msg.success('done');
        });
    }

    onCancel() {
        this._router.navigate(['function/myProjects']);
    }
}
