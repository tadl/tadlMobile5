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
    ln.isAppAvailable(ln.APP.GOOGLE_MAPS, function(isAvailable) {
      var app;
      if (isAvailable) {
        app = ln.APP.GOOGLE_MAPS;
      } else {
        if (this.platform.is('ios')) {
          app = ln.APP.APPLE_MAPS;
        } else {
          app = ln.APP.USER_SELECT;
        }
      }
      ln.navigate(this.address, {
        app: app
      });
    });
  }

  ngOnInit() {
    this.address = this.location['address'] + ', ' + this.location['citystatezip'];
  }

}
