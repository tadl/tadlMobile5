import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Platform } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { ToastService } from '../services/toast/toast.service';

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
    private toast: ToastService,
    private ln: LaunchNavigator,
    private platform: Platform,
  ) { }

  open_map() {
    let app;
    if (this.platform.is('android')) {
      app = (this.ln.isAppAvailable(this.ln.APP.GOOGLE_MAPS)) ? this.ln.APP.GOOGLE_MAPS : this.ln.APP.USER_SELECT;
    } else {
      app = (this.ln.isAppAvailable(this.ln.APP.GOOGLE_MAPS)) ? this.ln.APP.GOOGLE_MAPS : this.ln.APP.USER_SELECT;
    }
    this.ln.navigate(this.address, {
      app: app
    }).then(
      success => console.log('Launched navigator'),
      error => this.toast.present('Error' + error));
  }

  ngOnInit() {
    this.address = this.location['address'] + ', ' + this.location['citystatezip'];
  }

}
