import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { Person } from '../domain/person/person';
import { RegistrationComponent } from '../registration/registration.component';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { PersonService } from '../service/person/person.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  public user: Person;
  public editUser = new Person();
  private currentUsername: string;
  public refreshing: boolean;
  public isAdmin: boolean;
  public validPass: boolean;
  public passErrorString: string;
  private passRegex= '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  constructor(private authService: AuthenticationService,private personServie: PersonService, private router: Router,
              ) { }



  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin;
    this.user = this.authService.getUserFromLocalCache();
  }

  public onUpdateCurrentUser(person: Person): void {
    this.refreshing = true;
    this.currentUsername = this.authService.getUserFromLocalCache().username;
    const formData = this.personServie.createPersonFormData(this.currentUsername, person );
    this.subs.add(
      this.personServie.updateUser(formData).subscribe(
        (response: Person) => {
          this.authService.addUserToLocalCache(response);
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
          this.refreshing = false;
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
