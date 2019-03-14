import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { Location } from '@angular/common';

import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';

@Component({
  selector: 'app-holds',
  templateUrl: './holds.page.html',
  styleUrls: ['./holds.page.scss'],
})
export class HoldsPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public item: Item,
    public events: Events,
    private platform: Platform,
    private _location: Location,
  ) { }

  subscription: any;

  refresh_holds(event) {
    this.user.get_holds(false, event);
  }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_holds();
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
