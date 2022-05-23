import { Component, OnInit, ViewChild } from '@angular/core';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormControl} from '@angular/forms'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public mode = new FormControl('over');
  public shouldRun = true;
  constructor() { }

  ngOnInit(): void {
  }

  public toggle(): void {

  }
}
