import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './user/service/authentication.service';
import { PersonService } from './user/service/person.service';
import { IndexComponent } from './controller/index/index.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RegistrationComponent } from './user/controller/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from './modules/material.module';
import { LoginComponent } from './user/controller/login/login.component';
import { UserIndexComponent } from './user/controller/user-index/user-index.component';
import { AdminIndexComponent } from './user/controller/admin-index/admin-index.component';
import { AdminGuard } from './guard/admin.guard';
import { UserProfileComponent } from './user/controller/user-profile/user-profile.component';
import { DataTablesModule } from 'angular-datatables';
import { NavbarComponent } from './controller/navbar/navbar.component';
import { AgGridModule } from 'ag-grid-angular';
import { CreateNewTvComponent } from './tv/controller/create-new-tv/create-new-tv.component';
import { NotificationModule } from './modules/notification.module';
import { NotificationService } from './custom-features/notification.service';
import { UpdateTvComponent } from './tv/controller/update-tv/update-tv.component';
import { ResetPasswordComponent } from './user/controller/reset-password/reset-password.component';
import { CreateNewUserComponent } from './user/controller/create-new-user/create-new-user.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    RegistrationComponent,
    LoginComponent,
    UserIndexComponent,
    AdminIndexComponent,
    UserProfileComponent,
    NavbarComponent,
    CreateNewTvComponent,
    UpdateTvComponent,
    ResetPasswordComponent,
    CreateNewUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatSidenavModule,
    MatNativeDateModule,
    MaterialModule,
    DataTablesModule,
    NotificationModule,
    AgGridModule,
    ReactiveFormsModule,

  ],
  providers: [AuthenticationService, PersonService, NotificationService, AuthenticationGuard,AdminGuard,
    {provide: HTTP_INTERCEPTORS,
    useClass: AuthenticationInterceptor,
    multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
