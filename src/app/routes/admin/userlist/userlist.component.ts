import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TeamService } from '../../function/team.service';
import { LocalStorage } from '../../../core/local.storage';
import {_HttpClient} from '@delon/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-userlist',
    templateUrl: './userlist.component.html',
    providers: [ LocalStorage ]
    //styleUrls: ['./myTemplates.component.less']
})

export class UserListComponent implements OnInit {
    userName: String;
    userRole: String;
    userTeam: String;
    userList: any = [];
    userTotal = 0;
    data: any = [];
    roleList = [{name: '超级管理员', value: 'super'}, {name: '团队主管', value: 'admin'},
                    {name: '项目主管', value: 'manager'}, {name: '设计师', value: 'designer'}];
    enableList = [{name: '激活', value: true}, {name: '休眠', value: false}];
    teamList = [];

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
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        this.userName = currentUser.user.username;
        this._teamService.getAllTeams().subscribe(data => {
                for (let i = 0 ; i < data.length; i++) {
                    const team = data[i];
                    this.teamList = [ ...this.teamList, {
                        key    : i,
                        name: team.name,
                        alias: team.alias,
                        user: team.user,
                        expand: false
                    }];
                }
            },
            error => {
                this.data = [];
            });
        this.onClickRefreshUserList();
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
        /*
        this.teamList = [ ...this.teamList.sort((a, b) => {
            if (a[ this.sortName ] > b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[ this.sortName ] < b[ this.sortName ]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        }) ];
        */
    }

    onClickRefreshUserList() {
        this.userList = [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        this.userName = currentUser.user.username;
        this.userRole = currentUser.user.role;
        this.userTeam = currentUser.user.team;
        this._teamService.getUsers(this.userName, this.userRole, this.userTeam).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                data[i].description = '';
                if (data[i].status === undefined)
                    data[i].status = true;
                data[i].editFlag = false;
                if (data[i].role === 'super')
                    data[i].roleAlias = '超级管理员';
                else if (data[i].role === 'admin')
                    data[i].roleAlias = '团队主管';
                else if (data[i].role === 'manager')
                    data[i].roleAlias = '项目主管';
                else
                    data[i].roleAlias = '设计师';
                /*
                const user = data[i];
                this.userList = [ ...this.userList, {
                    id: user._id,
                    key    : i,
                    username: user.username,
                    team: user.team,
                    role: user.role,
                    alias: user.alias,
                    enable: user.enable,
                    roleAlias: user.roleAlias,
                    apikey: user.aplikey,
                    expand: false
                }];
                */
            }
            this.userTotal = data.length;
        },
        error => {
            this.data = [];
        });
    }

/*
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
*/
    cancelUser = function () {
        this.msg.info('click cancel');
    };

    confirmUser = (user) => {
        this.msg.info('click confirm');
        this._teamService.deleteUser(user._id).subscribe(data => {
            this.onClickRefreshUserList();
        });
    }

    onClickRole(user, role) {
        user.role = role.value;
        console.log(user.role);
        this._teamService.setUserInfo(user).subscribe(data => {
            this.onClickRefreshUserList();
        });
    }

    onClickTeam(user, team) {
        user.team = team.name;
        this._teamService.setUserInfo(user).subscribe(data => {
            this.onClickRefreshUserList();
        });
    }

    onClickEnbale(user, enable) {
        user.enable = enable.value;
        this._teamService.setUserInfo(user).subscribe(data => {
            this.onClickRefreshUserList();
        });
    }

    onEditRole = function (user) {
        user.editFlag = true;
    };

    editOKRole = function (user) {
        this._teamService.setUserInfo(user).subscribe(data => {
            this.onClickRefreshUserList();
        });
    };

    editCANCELRole = function (user) {
        user.editFlag = false;
    };

    onEditAlias = function (user) {
        user.editFlag = true;
    };

    editOKAlias = function (user) {
        this._teamService.setUserInfo(user).subscribe(data => {
            this.onClickRefreshUserList();
        });
    };

    editCANCELAlias = function (user) {
        user.editFlag = false;
    };

}
