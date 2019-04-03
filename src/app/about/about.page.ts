import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})

export class AboutPage implements OnInit {

  platforms: string = this.platform.platforms().join('/');
  device_keys: any = Object.keys(this.device);
  storage_driver: string = this.storage.driver;
  subscription: any;

  constructor(
    public globals: Globals,
    public user: User,
    private _location: Location,
    private platform: Platform,
    private device: Device,
    private storage: Storage,
  ) { }

  ngOnInit() {
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
