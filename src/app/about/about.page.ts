import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
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

  constructor(
    public globals: Globals,
    public user: User,
    private platform: Platform,
    private device: Device,
  ) { }

  ngOnInit() {
  }

}
