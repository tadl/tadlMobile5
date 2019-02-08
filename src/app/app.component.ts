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
    { title: 'Search Catalog', url: '/search', icon: 'search' },
    { title: 'Hours & Locations', url: '/locations', icon: 'compass' },
    { title: 'Account', url: '/account', icon: 'person' },
    { title: 'Events', url: '/events', icon: 'calendar' },
    { title: 'News', url: '/news', icon: 'megaphone' },
    { title: 'Featured Items', url: '/featured', icon: 'star' },
  ];

  public acctPages = [
    { title: 'Checkouts', url: '/checkouts' },
    { title: 'Holds', url: '/holds' },
    { title: 'Library Card', url: '/barcode' },
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
