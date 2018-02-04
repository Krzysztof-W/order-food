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
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MyGroupsComponent} from './my-groups/my-groups.component';
import {LoggedUserService} from './service/logged-user.service';
import {UserHeaderComponent} from './user-header/user-header.component';
import {GroupsService} from './service/groups.service';
import {TableComponent} from './table/table.component';
import {AuthGuard} from './guard/auth.guard';
import {MyGroupDetailsComponent} from './my-group-details/my-group-details.component';
import {RegistrationComponent} from './registration/registration.component';
import {AlertComponent} from './alert/alert.component';
import {AlertService} from './service/alert.service';
import {SearchUserComponent} from './search-user/search-user.component';
import {FoodProvidersComponent} from './food-providers/food-providers.component';
import { MenuComponent } from './menu/menu.component';
import {AppHttpInterceptor} from './service/app-http-interceptor';
import {FoodProviderDetailsComponent} from './food-provider-details/food-provider-details.component';
import {FoodProvidersService} from './service/food-providers.service';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'my-groups', component: MyGroupsComponent, canActivate: [AuthGuard]},
  {path: 'my-group/:id', component: MyGroupDetailsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MyGroupsComponent,
    MyGroupDetailsComponent,
    UserHeaderComponent,
    TableComponent,
    RegistrationComponent,
    AlertComponent,
    SearchUserComponent,
    FoodProvidersComponent,
    MenuComponent,
    FoodProviderDetailsComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    LoggedUserService,
    GroupsService,
    AuthGuard,
    AlertService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },
    FoodProvidersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
