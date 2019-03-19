import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';

@Component({
  selector: 'app-holds-ready',
  templateUrl: './holds-ready.page.html',
  styleUrls: ['./holds-ready.page.scss'],
})
export class HoldsReadyPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public item: Item,
    public events: Events,
    private platform: Platform,
    private _location: Location,
  ) { }

  subscription: any;

  refresh_holds_ready(event) {
    this.user.get_holds(true, event);
  }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_holds(true);
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
