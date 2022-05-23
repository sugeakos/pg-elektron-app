import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminIndexComponent } from './admin-index/admin-index.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserIndexComponent } from './user-index/user-index.component';

const routes: Routes = [
  {path: 'index', component: IndexComponent},
  {path:'register', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'user/index', component: UserIndexComponent},
  {path: 'admin/index', component: AdminIndexComponent},
  {path: '',redirectTo: 'index', pathMatch: 'full'},
  {path: '**',redirectTo: 'index', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
