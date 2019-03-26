import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Platform } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.page.html',
  styleUrls: ['./location-detail.page.scss'],
})
export class LocationDetailPage implements OnInit {

  location: any;
  address: string;

  constructor(
    public globals: Globals,
    private ln: LaunchNavigator,
    private platform: Platform,
  ) { }

  open_map() {
    if (this.ln.isAppAvailable(this.ln.APP.GOOGLE_MAPS)) {
      var app = this.ln.APP.GOOGLE_MAPS;
    } else {
      if (this.platform.is('ios')) {
        var app = this.ln.APP.APPLE_MAPS;
      } else {
        var app = this.ln.APP.USER_SELECT;
      }
    }
    this.ln.navigate(this.address, {
      app: app
    });
  }

  ngOnInit() {
    this.address = this.location['address'] + ', ' + this.location['citystatezip'];
  }

}
