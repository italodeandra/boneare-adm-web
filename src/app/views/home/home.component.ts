import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {
  constructor(private appComponent: AppComponent) {
  }

  ngOnInit() {
    this.appComponent.title = '';
  }
}
