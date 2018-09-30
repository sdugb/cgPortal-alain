import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { LocalStorage } from '../../../core/local.storage';
import {SocialService} from '@delon/auth';
import {PassportService} from '../../../routes/passport/passport.service';
import {TeamService} from '../../../routes/function/team.service';
import { Router } from '@angular/router';

@Component({
  selector   : 'app-sidebar',
  templateUrl: './sidebar.component.html',
    providers: [ LocalStorage ]
})
export class SidebarComponent {
    userName: String;
    userAlias: String;
    userRole: String

    constructor(public settings: SettingsService,
                public msgSrv: NzMessageService,
                private _router: Router,
                private _localStorage: LocalStorage) {
        console.log('sidebar');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        console.log('currentUser =', currentUser);
        if (!currentUser || currentUser.status) {
            this._router.navigate(['/']);
            return;
        }
        this.userName = currentUser.user.username;
        this.userRole = currentUser.user.role;
        this.userAlias = currentUser.user.alias;
        if (this.userRole === 'designer')
            this.userRole = '设计员';
        else if (this.userRole === 'manager')
            this.userRole = '项目主管';
        else if (this.userRole === 'admin')
            this.userRole = '团队主管';
        else
            this.userRole = '超级用户';
    }
}
