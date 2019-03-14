import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { Location } from '@angular/common';

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
    private platform: Platform,
    private _location: Location,
  ) { }

  subscription: any;

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

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      this._location.back();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
