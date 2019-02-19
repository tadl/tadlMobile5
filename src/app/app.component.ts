import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globals } from './globals';
import { User } from './user';
import { Item } from './item';

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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public globals: Globals,
    public user: User,
    public item: Item,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.user.autolog()
    });

  }
}
