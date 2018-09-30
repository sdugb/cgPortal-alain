import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorage } from '../../../core/local.storage';
import {_HttpClient} from '@delon/theme';
import { Router } from '@angular/router';

import { TeamService } from '../team.service';
@Component({
    selector: 'app-function-myTeams',
    templateUrl: './myTeams.component.html',
    providers: [TeamService, LocalStorage]
    // styleUrls: ['./myTeams.component.less']
})

export class MyTeamsComponent implements OnInit {
    userName: String;
    userRole: String;
    teamList = [];
    teamTotal = 0;
    subProjectTotal = 0;
    teamName: String;
    teamAlias: String;
    subProjectTitle: String;
    subProjectList: any = [];
    selectedTeam = null;
    selectedSubProject = null;
    data: any = [];
    teamFlag = true;

    constructor(
        private _localStorage: LocalStorage,
        private _teamService: TeamService,
        private msg: NzMessageService,
        private _router: Router) {

        console.log('list-constructor');
    }

    ngOnInit() {
        console.log('init-constructor');
        this.teamList = [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        this.userName = currentUser.user.username;
        this.userRole = currentUser.user.role;

        this._teamService.getTeams(this.userName, this.userRole)
            .subscribe(data1 => {
                const data = data1.team;
                for (let i = 0 ; i < data.length; i++) {
                    const team = data[i];
                    if (team.scale === '1')
                        team.scale_exp = '5-10人';
                    else if (team.scale === '2')
                        team.scale_exp = '10-30人';
                    else
                        team.scale_exp = '30人以上';

                    this.teamList = [ ...this.teamList, {
                        key    : i,
                        name: team.name,
                        alias: team.alias,
                        user: team.user,
                        scale_exp: team.scale_exp,
                        isKeepLiver: team.isKeepLiver,
                        url: team.url,
                        apiUrl: team.apiUrl,
                        mongoDBurl: team.mongoDBurl,
                        mongoDBuser: team.mongoDBuser,
                        mongoDBpassword: team.mongoDBpassword,
                        mongoDBname: team.mongoDBname,
                        mongoFileDBname: team.mongoFileDBname,
                        expand: false
                    }];
                }
                // this.teamList = data;
                this.teamTotal = data.length;

                this._teamService.setTeamList(this.teamList);
                this.teamName = '';
                this.teamAlias = '';
                if (this.teamList.length > 0) {
                    this.teamName = this.teamList[0].name;
                    this.teamAlias = this.teamList[0].alias;
                }
                // this._localStorage.setObject('teamName', this.teamName);
                // this._localStorage.setObject('teamAlias', this.teamAlias);
                this.subProjectTitle = '"' + this.teamAlias + '"的子项目：';
                this.data = [];
                this.subProjectTotal = 0;
                this._teamService.getMySubProjects(this.userName).subscribe(data1 => {
                        for (let i = 0; i < data1.length; i++) {
                            if (data1[i].team === this.teamName)
                                this.data.push(data1[i]);
                        }
                        console.log(this.data);
                        this.subProjectTotal = data1.length;
                    },
                    error => {
                        this.data = [];
                        this.subProjectTotal = 0;
                    });
            },
            error => {
                this.teamList = [];
                // this._localStorage.setObject('teamName', '');
                // this._localStorage.setObject('teamAlias', '');
                // this._localStorage.setObject('teamID', '');
            });
    }

    onClickRefreshTeam() {
        this.teamList = [];
        console.log('onClickRefreshTeam');
        this._teamService.getTeams(this.userName, this.userRole)
            .subscribe(data => {
                for (let i = 0 ; i < data.length; i++) {
                    const team = data[i];
                    if (team.scale === '1')
                        team.scale_exp = '5-10人';
                    else if (team.scale === '2')
                        team.scale_exp = '10-30人';
                    else
                        team.scale_exp = '30人以上';
                    this.teamList = [ ...this.teamList, {
                        key    : i,
                        name: team.name,
                        user: team.user,
                        alias: team.alias,
                        scale_exp: team.scale_exp,
                        url: team.url,
                        apiUrl: team.apiUrl,
                        mongoDBUrl: team.mongoDBUrl,
                        mongoDBUser: team.mongoDBUser,
                        mongoDBPassword: team.mongoDBPassword,
                        mongoDBName: team.mongoDBName,
                        mongoFileDBName: team.mongoFileDBName,
                        expand: false
                    }];
                }
                this.teamList = data;
                this.teamTotal = data.length;

                this._teamService.setTeamList(this.teamList);
                this.teamName = '';
                this.teamAlias = '';
                if (this.teamList.length > 0) {
                    this.teamName = this.teamList[0].name;
                    this.teamAlias = this.teamList[0].alias;
                }
                // this._localStorage.setObject('teamName', this.teamName);
                // this._localStorage.setObject('teamAlias', this.teamAlias);
                this.subProjectTitle = '"' + this.teamAlias + '"的子项目：';
                this.data = [];
                this.subProjectTotal = 0;
                this._teamService.getMySubProjects(this.userName).subscribe(data1 => {
                        for (let i = 0; i < data1.length; i++) {
                            if (data1[i].team === this.teamName)
                                this.data.push(data1[i]);
                        }
                        console.log(this.data);
                        this.subProjectTotal = data1.length;
                    },
                    error => {
                        this.data = [];
                        this.subProjectTotal = 0;
                    });
            },
            error => {
                this.teamList = [];
                // this._localStorage.setObject('teamName', '');
                // this._localStorage.setObject('teamAlias', '');
                // this._localStorage.setObject('teamID', '');
            });
    }

    onClickCreateTeam() {
        this._router.navigate(['/pages/team']);
    }

    onSelectTeam(team) {
        // this._localStorage.setObject('teamName', team.name);
        // this._localStorage.setObject('teamAlias', team.alias);
        this.teamName = team.name;
        this.teamAlias = team.alias;
        this.subProjectTitle = '"' + this.teamAlias + '"的子项目：';
        this.data = [];
        this.subProjectList = [];
        this.subProjectTotal = 0;
        this._teamService.getMyTeamProjects(this.teamName).subscribe((data: any) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                if (data[i].team === this.teamName)
                    this.data.push(data[i]);
            }
            this.teamFlag = false;
            this.subProjectList = this.data;
            this.subProjectTotal = data.length;
            console.log('subProjectTotal =', this.subProjectTotal);
        });

    }

    cancelTeam = function () {
        this.msg.info('click cancel');
    };

    confirmTeam = (team) => {
        this.msg.info('click confirm');
        this._teamService.deleteTeam(team._id).subscribe(data => {
            this.onClickRefreshTeam();
        });
    }

    onClickRefreshSubProject() {
        this.subProjectList = [];
        this._teamService.getMySubProjects(this.userName).subscribe(data1 => {
                for (let i = 0; i < data1.length; i++) {
                    if (data1[i].team === this.teamName)
                        this.subProjectList.push(data1[i]);
                }
                this.subProjectTotal = data1.length;
            },
            error => {
                this.subProjectList = [];
            });
    }

    cancelSubProject = function () {
        this.msg.info('click cancel');
    };

    confirmSubProject(subProject) {
        this.msg.info('click confirm');
        this._teamService.deleteSubProject(subProject.name).subscribe(data => {
            this.onClickRefreshSubProject();
        });
    }

    onClickExpandTeam(team) {
        console.log('onClickExpand');
        if (this.selectedTeam === null) {
            team.expand = true;
        } else if (this.selectedTeam === team) {
            team.expand = !team.expand;
            //this.selectedTeam.nzShowExpand = true;
        } else {
            this.selectedTeam.expand = false;
            //this.selectedTeam.nzShowExpand = false;
            team.expand = true;
        }
        this.selectedTeam = team;
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

    onRunTeam(team) {
        console.log(team.name);
        this._teamService.runTeamDocker(team.name).subscribe(data => {
            window.open(team.url);
        });
    }

    onGotoTeam(team) {
        window.open(team.url);
    }

    onClickBack() {
        this.teamFlag = true;
    }
}
