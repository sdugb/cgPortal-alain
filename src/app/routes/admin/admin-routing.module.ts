import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './userlist/userlist.component';
import { ProjectListComponent } from './projectlist/projectlist.component';

const routes: Routes = [
    { path: 'userlist', component: UserListComponent},
    { path: 'projectlist', component: ProjectListComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
