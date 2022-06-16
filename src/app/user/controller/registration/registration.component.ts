import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SubSink} from 'subsink';
import {Person} from '../../domain/person';
import {AuthenticationService} from '../../service/authentication.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  private subs = new SubSink();
  public validPass: boolean;
  public passErrorString: string;
  private passRegex= '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';

  constructor(private router: Router, private authService: AuthenticationService) {
  }


  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/person/index');
    }
  }

  public onRegister(user: Person): void {

    this.subs.add(
      this.authService.register(user).subscribe(
        (response: Person) => {
          console.log(response);
          this.showLoading = false;
          this.router.navigateByUrl("/login");
        },
        (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  public checkPasswords(password: string, passwordCheck: string): boolean {
    if (password.match(this.passRegex)) {
      if (password.match(passwordCheck)){
        this.validPass = true;
        this.passErrorString = '';
        return true;

      } else {

        this.validPass = false;
        this.passErrorString = 'A két jelszó nem egyezik.';
        return false;

      }
    } else {
      this.validPass = false;
      this.passErrorString = 'A jelszónak minimum 8 karakter hosszúnak kell lennie, tartalmaznia kell: legalább 1 kisbetűt, 1 nagybetűt, 1 számot, és 1 speciális karaktert: $@$!%&';
      return false;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
