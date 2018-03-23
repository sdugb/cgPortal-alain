import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { getTimeDistance, yuan } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { TeamService } from '../team.service';
import { LocalStorage } from '../../../core/local.storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-function-myProjects',
    templateUrl: './myProjects.component.html',
    styleUrls: ['./myProjects.component.less']
})

export class MyProjectsComponent implements OnInit {
    projectList: any = [];
    subProjectList: any = [];
    projectTotal = 0;
    subProjectTotal = 0;
    userName: String;
    projectName: string;
    subProjectName: string;
    initMyTitle: any = {};
    subProjectTitle: string;

    constructor(
        private _localStorage: LocalStorage,
        private _teamService: TeamService,
        private msg: NzMessageService,
        private _router: Router) {}

    ngOnInit() {
        this.userName = this._localStorage.getObject('username');
        this.onClickRefreshProject();
    }

    onClickRefreshProject() {
        this.projectList = [];
        this.userName = this._localStorage.getObject('username');
        this._teamService.getMyProjects(this.userName).subscribe(data => {
                this.projectList = data;
                if (this.projectList === []) {
                    this.projectName = '';
                }
                this.projectTotal = data.length;
                this.projectName = this.projectList[0].name;
                this._localStorage.setObject('projectName', this.projectName);
                this.subProjectTitle = '"' + this.projectName + '"的子项目：';
                this.subProjectList = [];
                this._teamService.getMySubProjects(this.userName).subscribe(data1 => {
                        for (let i = 0; i < data1.length; i++) {
                            if (data1[i].project === this.projectName)
                                this.subProjectList.push(data1[i]);
                        }
                        this.subProjectTotal = data1.length;
                    },
                    error => {
                        this.subProjectList = [];
                    });
            },
            error => {
                this.projectList = [];
                this._localStorage.setObject('projectName', '');
            });
    }

    cancelProject = function () {
        this.msg.info('click cancel');
    };

    confirmProject = (project) => {
        this.msg.info('click confirm');
        this._teamService.deleteProject(project._id).subscribe(data => {
            this.onClickRefreshProject();
        });
    }

    onSelectProject(subProject) {
        this._localStorage.setObject('projectName', this.projectName);
        this.projectName = subProject.name;
        this.subProjectTitle = '"' + this.projectName + '"的子项目：';
        this.subProjectList = [];
        this._teamService.getMySubProjects(this.userName).subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].project === this.projectName)
                        this.subProjectList.push(data[i]);
                }
            },
            error => {
                this.subProjectList = [];
            });
    }

    onClickCreateProject() {
        this._router.navigate(['/pages/project']);
    }

    onCreateSubProject(project) {
        //Cookie.set('projectName', this.projectList[index].name);
        this._router.navigate(['/dashboard/subProject']);
    }

    cancelSubProject() {
        this.msg.info('click cancel');
    }
}

