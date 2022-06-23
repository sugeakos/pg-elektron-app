import { HttpErrorResponse } from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationService} from 'src/app/custom-features/notification.service';
import {NotificationType} from 'src/app/enumeration/notification.type';
import {AuthenticationService} from 'src/app/user/service/authentication.service';
import {SubSink} from 'subsink';
import { TvCategory } from '../../domain/tv-category';
import {TvCategoryService} from '../../service/tv-category.service';

@Component({
  selector: 'app-add-new-tv-category',
  templateUrl: './add-new-tv-category.component.html',
  styleUrls: ['./add-new-tv-category.component.scss']
})
export class AddNewTvCategoryComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  private newTvCat = new TvCategory();

  public tvCatDescriptionControl: FormControl = new FormControl('',[Validators.required]);
  constructor(private authService: AuthenticationService, private router: Router, private tvCatService: TvCategoryService,
              private notifier: NotificationService) {
  }

  ngOnInit(): void {
    if (!this.authService.isAdminLoggedIn()) {
      this.router.navigateByUrl('/user/index');
    }

  }

  saveNewTvCategory() {
    this.newTvCat.description = this.tvCatDescriptionControl.value;
    this.subs.add(
      this.tvCatService.addNewTvCategory(this.newTvCat).subscribe(
        (response: TvCategory | null) => {
          if(response == null){
            this.tvCatDescriptionControl.reset();
            this.notifier.sendNotification(NotificationType.WARNING,`${this.newTvCat.description} már benne van az adatbázisban.` );
          }
          this.tvCatDescriptionControl.reset();
          this.notifier.sendNotification(NotificationType.SUCCESS,`Sikeresen el lett mentve a következő márka ${response.description}`);

        },
        (error: HttpErrorResponse) => {
          this.tvCatDescriptionControl.reset();
          this.notifier.sendNotification(NotificationType.ERROR,`Hiba történt ${error.error.message}`);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
