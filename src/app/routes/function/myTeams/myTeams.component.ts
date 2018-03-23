import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TeamService } from '../team.service';
import { LocalStorage } from '../../../core/local.storage';
import {_HttpClient} from '@delon/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'app-function-myTeams',
    templateUrl: './myTeams.component.html',
    styleUrls: ['./myTeams.component.less']
})

export class MyTeamsComponent implements OnInit {
    userName: String;
    teamList: any = [];
    teamTotal = 0;
    subProjectTotal = 0;
    teamName: String;
    teamAlias: String;
    subProjectTitle: String;
    subProjectList: any = [];

    sortMap = {
        name   : null,
        app_count    : null
    };
    sortName = null;
    sortValue = null;

    constructor(
        private _localStorage: LocalStorage,
        private _teamService: TeamService,
        private msg: NzMessageService,
        private _router: Router) {}

    ngOnInit() {
        console.log('ngOnInit');
        this.userName = this._localStorage.getObject('username');
        this.onClickRefreshTeam();
    }

    sort_user(sortName, value) {
        this.sortName = sortName;
        this.sortValue = value;
        Object.keys(this.sortMap).forEach(key => {
            if (key !== sortName) {
                this.sortMap[ key ] = null;
            } else {
                this.sortMap[ key ] = value;
            }
        });
        this.search();
    }

    search() {
        console.log('search');
        /*
        const searchAddress = this.filterAddressArray.filter(address => address.value);
        const searchName = this.filterNameArray.filter(name => name.value);
        const filterFunc = (item) => {
            return (searchAddress.length ? searchAddress.some(address => item.address.indexOf(address.name) !== -1) : true) &&
                (searchName.length ? searchName.some(name => item.name.indexOf(name.name) !== -1) : true)
        };
        */
        //this.userList = [ ...this.userList_copyData.filter(item => filterFunc(item)) ];
        this.teamList = [ ...this.teamList.sort((a, b) => {
            if (a[ this.sortName ] > b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[ this.sortName ] < b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        }) ];
    }

    onClickRefreshTeam() {
        this.teamList = [];
        this._teamService.getMyTeams(this.userName).subscribe(data => {
                this.teamList = data;
                this.teamTotal = data.length;
                this._teamService.setTeamList(this.teamList);
                this.teamName = '';
                this.teamAlias = '';
                if (this.teamList !== []) {
                    this.teamName = this.teamList[0].name;
                    this.teamAlias = this.teamList[0].alias;
                }
                this._localStorage.setObject('teamName', this.teamName);
                this._localStorage.setObject('teamAlias', this.teamAlias);
                this.subProjectTitle = '"' + this.teamAlias + '"的子项目：';
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
            },
            error => {
                this.teamList = [];
                this._localStorage.setObject('teamName', '');
                this._localStorage.setObject('teamAlias', '');
            });
    }

    onClickCreateTeam() {
        this._router.navigate(['/pages/team']);
    }

    onSelectTeam(team) {
        this._localStorage.setObject('teamName', team.name);
        this._localStorage.setObject('teamAlias', team.alias);
        this.teamName = team.name;
        this.teamAlias = team.alias;
        this.subProjectTitle = '"' + this.teamAlias + '"的子项目：';
        this.subProjectList = [];
        this._teamService.getMySubProjects(this.userName).subscribe((data: any) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].team === this.teamName)
                    this.subProjectList.push(data[i]);
            }
            this.subProjectTotal = data.length;
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
        this._teamService.deleteSubProject(subProject._id).subscribe(data => {
            this.onClickRefreshSubProject();
        });
    }
}
