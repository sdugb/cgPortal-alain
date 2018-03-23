import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTeamsComponent } from './myTeams/myTeams.component';
import { MyProjectsComponent } from './myProjects/myProjects.component';
import { MyTemplatesComponent } from './myTemplates/myTemplates.component';

const routes: Routes = [
    { path: 'myTeams', component: MyTeamsComponent},
    { path: 'myProjects', component: MyProjectsComponent},
    { path: 'myTemplates', component: MyTemplatesComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FunctionRoutingModule { }
