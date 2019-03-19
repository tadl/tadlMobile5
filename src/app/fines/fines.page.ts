import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-fines',
  templateUrl: './fines.page.html',
  styleUrls: ['./fines.page.scss'],
})
export class FinesPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    private platform: Platform,
    private _location: Location,
  ) { }

  subscription: any;

  ngOnInit() {
    if (this.user.token) {
      this.user.get_fines();
    }
    this.events.subscribe('logged_in', () => {
      this.user.get_fines();
      this.events.unsubscribe('logged_in');
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('logged_in');
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
