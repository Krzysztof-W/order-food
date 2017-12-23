import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonModule} from '@angular/common';
import {AuthService} from './service/auth.service';
import {HttpModule} from '@angular/http';
import {MyGroupsComponent} from './my-groups/my-groups.component';
import {LoggedUserService} from './service/logged-user.service';
import {UserHeaderComponent} from './user-header/user-header.component';
import {GroupsService} from './service/groups.service';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'my-groups', component: MyGroupsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MyGroupsComponent,
    UserHeaderComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpModule
  ],
  providers: [AuthService, LoggedUserService, GroupsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
