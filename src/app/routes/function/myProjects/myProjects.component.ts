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
    providers: [TeamService, LocalStorage],
    styleUrls: ['./myProjects.component.less']
})

export class MyProjectsComponent implements OnInit {
    projectList: any = [];
    subProjectList: any = [];
    projectTotal = 0;
    subProjectTotal = 0;
    userName: String;
    userRole: String;
    projectName: string;
    subProjectName: string;
    initMyTitle: any = {};
    subProjectTitle: string;
    selectedProject = null;
    selectedSubProject = null;
    projectFlag = true;

    constructor(
        private _localStorage: LocalStorage,
        private _teamService: TeamService,
        private msg: NzMessageService,
        private _router: Router) {
        console.log('myProjects');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/']);
            return;
        }
        this.userName = currentUser.user.username;
        this.userRole = currentUser.user.role;
    }

    ngOnInit() {
        this.onClickRefreshProject();
    }

    onClickRefreshProject() {
        this.projectList = [];
        this._teamService.getProjects(this.userName, this.userRole).subscribe(data => {
                for (let i = 0 ; i < data.length; i++) {
                    const project = data[i];
                    this.projectList = [ ...this.projectList, {
                        key    : i,
                        name: project.name,
                        alias: project.alias,
                        user: project.user,
                        timeUnit: project.timeUnit,
                        render: project.render,
                        designTool: project.designTool,
                        xResolution: project.xResolution,
                        yResolution: project.yResolution,
                        enable: project.enable,
                        expand: false
                    }];
                }
                this.projectTotal = data.length;
            },
            error => {
                this.projectList = [];
                localStorage.setItem('projectName', '');
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

    onSelectProject(projectName) {
        this.projectName = projectName;
        this.subProjectTitle = '"' + this.projectName + '"的子项目：';
        this.subProjectList = [];
        this.subProjectTotal = 0;
        this._teamService.getSubProjects(this.projectName).subscribe(data => {
            console.log(data);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].project === this.projectName)
                        this.subProjectList.push(data[i]);
                }
                this.subProjectTotal = this.subProjectList.length;
                this.projectFlag = false;
            },
            error => {
                this.subProjectList = [];
            });
    }

    onClickCreateProject() {
        this._router.navigate(['/pages/project']);
    }

    onClickCreateSubProject(projectName) {
        console.log(projectName);
        this._localStorage.setObject('projectName', projectName);
        localStorage.setItem('currentProjectName', projectName);
        this._router.navigate(['/pages/subProject']);
    }

    cancelSubProject() {
        this.msg.info('click cancel');
    }

    confirmSubProject = (subProject) => {
        this.msg.info('click confirm');
        this._teamService.deleteSubProject(subProject.name).subscribe(data => {
            this.onSelectProject(this.projectName);
        });
    }

    onClickExpandProject(project) {
        if (this.selectedProject === null) {
            project.expand = true;
        } else if (this.selectedProject === project) {
            project.expand = !project.expand;
        } else {
            this.selectedProject.expand = false;
            this.selectedProject.nzShowExpand = true;
            project.expand = true;
        }
        this.selectedProject = project;
    }

    onClickExpandSubProject(subProject) {
        console.log('onClickExpand');
        if (this.selectedSubProject === null) {
            subProject.expand = true;
        } else if (this.selectedSubProject === subProject) {
            subProject.expand = !subProject.expand;
        } else {
            this.selectedSubProject.expand = false;
            this.selectedSubProject.nzShowExpand = true;
            subProject.expand = true;
        }
        this.selectedSubProject = subProject;
    }

    onClickBack() {
        this.projectFlag = true;
    }
}

