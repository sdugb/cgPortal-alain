import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FunctionRoutingModule } from './function-routing.module';
import { MyTeamsComponent } from './myTeams/myTeams.component';
import { MyProjectsComponent } from './myProjects/myProjects.component';
import { MyTemplatesComponent } from './myTemplates/myTemplates.component';
//import { LocalStorage } from '../../core/local.storage';
//import { TeamService } from './team.service';
const COMPONENT_NOROUNT = [];

@NgModule({
    imports: [
        SharedModule,
        FunctionRoutingModule
    ],
    declarations: [
        ...COMPONENT_NOROUNT,
        MyTeamsComponent,
        MyProjectsComponent,
        MyTemplatesComponent
    ],
    providers: [],
    entryComponents: COMPONENT_NOROUNT
})
export class FunctionModule { }
