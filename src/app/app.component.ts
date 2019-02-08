import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public mainPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Search Catalog', url: '/search', icon: '' },
    { title: 'Hours & Locations', url: '/locations', icon: '' },
    { title: 'Account', url: '/account', icon: '' },
    { title: 'Events', url: '/events', icon: '' },
    { title: 'News', url: '/news', icon: '' },
    { title: 'Featured Items', url: '/featured', icon: '' },
  ];

  public acctPages = [
    { title: 'Checkouts', url: '/checkouts', icon: '' },
    { title: 'Holds', url: '/holds', icon: '' },
    { title: 'Library Card', url: '/barcode', icon: '' },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

  }
}
