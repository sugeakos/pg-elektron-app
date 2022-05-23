import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {path: 'index', component: IndexComponent},
  {path:'register', component: RegistrationComponent},
  {path: '',redirectTo: 'index', pathMatch: 'full'},
  {path: '**',redirectTo: 'index', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
