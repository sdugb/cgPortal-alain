import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { getTimeDistance, yuan } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { TeamService } from '../../function/team.service';
import { LocalStorage } from '../../../core/local.storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-projectlist',
    templateUrl: './projectlist.component.html',
    providers: [ LocalStorage ]
    // styleUrls: ['./myProjects.component.less']
})

export class ProjectListComponent implements OnInit {
    projectList: any = [];
    subProjectList: any = [];
    projectTotal = 0;
    subProjectTotal = 0;
    userName: String;
    projectName: string;
    subProjectName: string;
    initMyTitle: any = {};
    subProjectTitle: string;
    selectedProject = null;
    selectedSubProject = null;
    designToolList;
    renderList;

    constructor(
        private _localStorage: LocalStorage,
        private _teamService: TeamService,
        private msg: NzMessageService,
        private _router: Router) {

        this.designToolList = ['maya2014', 'maya2015', 'maya2016', 'maya2017', 'maya2018', '3dsMax2012', '3dsMax2014', '3dsMax2016', '3dsMax2018'];
        this.renderList = ['arnold', 'redshift', 'Vray', 'mayaSoftware', 'mayaHardware'];

    }

    ngOnInit() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        this.userName = currentUser.user.username;
        this.onClickRefreshProject();
    }

    onClickRefreshProject() {
        this.projectList = [];
        this._teamService.getAllSubProjects().subscribe(data => {
                this.projectList = data;
                if (this.projectList === []) {
                    this.projectName = '';
                }
                this.projectTotal = data.length;
                if (this.projectList.length > 0)
                    this.projectName = this.projectList[0].name;
                this._localStorage.setObject('projectName', this.projectName);
            },
            error => {
                this.projectList = [];
                this._localStorage.setObject('projectName', '');
            });
    }

    onActivateProject(project) {

    }

    onUnActivateProject(project) {

    }

    onClickDesignTool(project, designTool){
        this._teamService.setProjectDesignTool(project._id, designTool).subscribe(data => {
            this.onClickRefreshProject();
        });
    }

    onClickRender(project, render){
        this._teamService.setProjectRender(project._id, render).subscribe(data => {
            this.onClickRefreshProject();
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
        localStorage.setItem('currentUser', JSON.stringify(this.projectName));
        this.projectName = projectName;
        this.subProjectTitle = '"' + this.projectName + '"的子项目：';
        this.subProjectList = [];
        this.subProjectTotal = 0;
        this._teamService.getMyProjectSubProjects(this.projectName).subscribe(data => {
            console.log(data);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].project === this.projectName)
                        this.subProjectList.push(data[i]);
                }
                this.subProjectTotal = this.subProjectList.length;
            },
            error => {
                this.subProjectList = [];
            });
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
        console.log('onClickExpand');
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
}

