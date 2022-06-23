import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminIndexComponent } from './user/controller/admin-index/admin-index.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthenticationGuard } from './guard/authentication.guard';
import { IndexComponent } from './controller/index/index.component';
import { LoginComponent } from './user/controller/login/login.component';
import { RegistrationComponent } from './user/controller/registration/registration.component';
import { UserIndexComponent } from './user/controller/user-index/user-index.component';
import { UserProfileComponent } from './user/controller/user-profile/user-profile.component';
import { CreateNewTvComponent } from './tv/controller/create-new-tv/create-new-tv.component';
import { UpdateTvComponent } from './tv/controller/update-tv/update-tv.component';
import { ResetPasswordComponent } from './user/controller/reset-password/reset-password.component';
import { CreateNewUserComponent } from './user/controller/create-new-user/create-new-user.component';
import { AddTvToUserComponent } from './tv/controller/add-tv-to-user/add-tv-to-user.component';

const routes: Routes = [
  {path: 'index', component: IndexComponent},
  {path:'register', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'user/index', component: UserIndexComponent, canActivate: [AuthenticationGuard]},
  {path: 'user/profile', component: UserProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'user/new',component: CreateNewUserComponent, canActivate: [AdminGuard]},
  {path: 'admin/index', component: AdminIndexComponent, canActivate: [AdminGuard]},
  {path:'tv/create', component:CreateNewTvComponent, canActivate: [AuthenticationGuard]},
  {path:'tv/create/:email', component:AddTvToUserComponent, canActivate: [ AdminGuard]},
  {path:'tv/update/:id', component:UpdateTvComponent, canActivate: [AuthenticationGuard]},


  {path: '',redirectTo: 'index', pathMatch: 'full'},
  {path: '**',redirectTo: 'index', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
