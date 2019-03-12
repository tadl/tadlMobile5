import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';

import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.page.html',
  styleUrls: ['./checkouts.page.scss'],
})
export class CheckoutsPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    public item: Item,
  ) { 
  }

  refresh_checkouts(event) {
    this.user.get_checkouts(event);
  }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_checkouts();
    }
  }

  ngOnDestroy() {
  }

}
