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
    selector: 'app-pages-subProject',
    templateUrl: './subProject.component.html',
    // styleUrls: ['./subProject.component.css'],
    providers: [TeamService, LocalStorage]
})

export class SubProjectComponent implements OnInit {
    validateForm: FormGroup;
    userName: String;
    userRole: String;
    projectName: String;
    teamList: any = [];
    templateList: any = [];
    title: String;
    project: any = {};

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
                this.index = 'third-content';
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
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log('subproject');
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        console.log('subproject', currentUser);
        this.userName = currentUser.user.username;
        this.userRole = currentUser.user.role;
        this.projectName = this._localStorage.getObject('projectName');
        // this.projectName = JSON.parse(localStorage.getItem('currentProjectName'));
        // console.log('subproejct1111');
        console.log(this.projectName);
        this.title = '项目:' + this.projectName + '分包';
        this._teamService.getMyTeams(this.userName).subscribe(data => {
            this.teamList = data;
            this._teamService.getTemplates(this.userName, this.userRole).subscribe(data1 => {
                this.templateList = data1;
                this._teamService.getProjectInfo(this.projectName).subscribe(data2 => {
                    this.project = data2[0];
                    console.log('project =', this.project);
                });
            });
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
            team             : [ null ],
            templateName     : [ null ]
        });
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onCreateSubProject() {
        const name = this.getFormControl('name').value;
        const team = this.getFormControl('team').value;
        const templateName = this.getFormControl('templateName').value;
        let templateStage = '';
        for (const temp of this.templateList) {
            if (templateName === temp.name) {
                templateStage = temp.stage;
                break;
            }
        }
        const subProject = {  user: this.userName,
            name: name,
            team: team,
            project: this.projectName,
            templateName: templateName,
            templateStage: templateStage,
            designTool: this.project.designTool,
            render: this.project.render,
            timeUnit: this.project.timeUnit,
            xResolution: this.project.xResolution,
            yResolution: this.project.yResolution};
        console.log('subProject =', subProject);
        this._teamService.createSubProject(subProject).subscribe(data => {
            this.msg.success('done');
            console.log('function/myProjects');
            this._router.navigate(['function/myProjects']);
        });
    }

    onTest() {
        const team = this.getFormControl('team').value;
        this._teamService.getTeam(team).subscribe(data => {
            this.msg.success('done');
        }, error => {
            this.msg.warning('团队服务器没有启动（消息将于10秒后消失）', {nzDuration: 10000});
        });
    }

    onCancel() {
        this._router.navigate(['function/myProjects']);
    }
}
