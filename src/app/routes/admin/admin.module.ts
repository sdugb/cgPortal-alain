import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { UserListComponent } from './userlist/userlist.component';
import { ProjectListComponent } from './projectlist/projectlist.component';
import { LocalStorage } from '../../core/local.storage';
import { TeamService } from '../function/team.service';
const COMPONENT_NOROUNT = [];

@NgModule({
    imports: [
        SharedModule,
        AdminRoutingModule
    ],
    declarations: [
        ...COMPONENT_NOROUNT,
        UserListComponent,
        ProjectListComponent
    ],
    providers: [ TeamService, LocalStorage],
    entryComponents: COMPONENT_NOROUNT
})
export class AdminModule { }
