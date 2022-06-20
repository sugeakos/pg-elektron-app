import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import {TvCategory} from 'src/app/tv-category/domain/tv-category';
import {TvCategoryService} from 'src/app/tv-category/service/tv-category.service';
import {Person} from 'src/app/user/domain/person';
import {AuthenticationService} from 'src/app/user/service/authentication.service';
import {PersonService} from 'src/app/user/service/person.service';
import {SubSink} from 'subsink';
import {Tv} from '../../domain/tv';
import {TvService} from '../../service/tv.service';

@Component({
  selector: 'app-create-new-tv',
  templateUrl: './create-new-tv.component.html',
  styleUrls: ['./create-new-tv.component.scss']
})
export class CreateNewTvComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public loggedInUser: Person; //logged in user
  public tvCategory: string;
  public tvCategories: TvCategory[];
  public newTv: Tv;
  public loggedInUsersEmail: string;

  constructor(private personService: PersonService, private authService: AuthenticationService, private tvService: TvService,
              private tvCatService: TvCategoryService, private router: Router) {
  }


  ngOnInit(): void {
    this.loggedInUser = this.authService.getUserFromLocalCache();
    this.loggedInUsersEmail = this.loggedInUser.email;
    this.getAllCategories();
  }

  public getAllCategories(): void {
    this.subs.add(
      this.tvCatService.getCategories().subscribe(
        (response: TvCategory[]) => {
          this.tvCategories = response;

        },
        (err: HttpErrorResponse) => {
          console.log(err.error.message);
        }
      )
    );
  }

  public onAddNewTv(tvForm: NgForm): void {
    this.newTv = new Tv();
    this.newTv.personEmail = tvForm.controls['personEmail'].value.toString();
    this.newTv.tvCategoryDescription = tvForm.controls['tvCategoryDescription'].value;
    this.newTv.errorSeenByCustomer = tvForm.controls['errorSeenByCustomer'].value;
    this.newTv.reservedDateToRepair = Date.parse(tvForm.controls['reservedDateToRepair'].value);

    this.subs.add(
      this.tvService.addNewTv(this.newTv).subscribe(
        (response: Tv) => {
          tvForm.resetForm();
          this.router.navigateByUrl('/user/index');
        },
        (err: HttpErrorResponse) => {

          console.log(err.error.message);
          console.log(err.message);
          tvForm.reset();
        }
      )
    );
  }

  public saveNewTv(): void {
    this.clickButton('new-tv-save');
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
