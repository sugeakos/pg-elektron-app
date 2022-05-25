import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthenticationGuard } from './guard/authentication.guard';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {path: 'index', component: IndexComponent},
  {path:'register', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'user/index', component: UserIndexComponent, canActivate: [AuthenticationGuard]},
  {path: 'user/profile', component: UserProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'admin/index', component: AdminIndexComponent, canActivate: [AdminGuard]},
  {path: '',redirectTo: 'index', pathMatch: 'full'},
  {path: '**',redirectTo: 'index', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
