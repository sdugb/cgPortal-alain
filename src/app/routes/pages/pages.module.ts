import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

import { LoginComponent } from './login/login.component';
import { LockComponent } from './lock/lock.component';
import { RegisterComponent } from './register/register.component';
import { ForgetComponent } from './forget/forget.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './404/404.component';
import { Page500Component } from './500/500.component';
import { TeamComponent } from './team/team.component';
import { ProjectComponent } from './project/project.component';
import { SubProjectComponent } from './subProject/subProject.component';
import { TemplateComponent } from './template/template.component';

import { TeamService } from '../function/team.service';
import { LocalStorage } from '../../core/local.storage';

@NgModule({
  imports: [ SharedModule, PagesRoutingModule ],
  declarations: [
    LoginComponent,
    LockComponent,
    RegisterComponent,
    ForgetComponent,
    MaintenanceComponent,
    Page404Component,
    Page500Component,

      TeamComponent,
      ProjectComponent,
      SubProjectComponent,
      TemplateComponent
  ],
    providers: [TeamService, LocalStorage]
})
export class PagesModule { }
