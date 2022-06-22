import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/custom-features/notification.service';
import { SubSink } from 'subsink';
import { PersonService } from '../../service/person.service';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent implements OnInit {

  private subs = new SubSink();
  public showLoading: boolean = false;
  public firstNameControl: FormControl = new FormControl('', [Validators.required]);
  public lastNameControl: FormControl = new FormControl('', [Validators.required]);
  constructor(private personService: PersonService, private notifier: NotificationService, ) { }

  ngOnInit(): void {
  }

}
