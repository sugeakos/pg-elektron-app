import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { UserIndexComponent } from '../user-index/user-index.component';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {


  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isAdminLoggedIn();
  }

  private isAdminLoggedIn(): boolean {
    if (this.authService.isAdminLoggedIn()){
      return true;
    }
    this.router.navigate(['/login'])
    return false;
  }
}
