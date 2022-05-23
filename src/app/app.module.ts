import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication/authentication.service';
import { PersonService } from './service/person/person.service';
import { IndexComponent } from './index/index.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RegistrationComponent } from './registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from './modules/material.module';
import { LoginComponent } from './login/login.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { AdminIndexComponent } from './admin-index/admin-index.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    RegistrationComponent,
    LoginComponent,
    UserIndexComponent,
    AdminIndexComponent
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
    MaterialModule
  ],
  providers: [AuthenticationService, PersonService, AuthenticationGuard,
    {provide: HTTP_INTERCEPTORS,
    useClass: AuthenticationInterceptor,
    multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
