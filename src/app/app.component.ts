import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Platform, MenuController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Globals } from './globals';
import { User } from './user';
import { Item } from './item';

import { CardPage } from './card/card.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  navLinksArray: any = [];

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private modalController: ModalController,
    public globals: Globals,
    public user: User,
    public item: Item,
  ) {
    this.initializeApp();
    this.router.events.subscribe(event => {
      const url = this.router.url;
      if (event instanceof NavigationEnd) {
        const isCurrentUrlSaved = this.navLinksArray.find((item) => { return item === url; });
        if (!isCurrentUrlSaved) { this.navLinksArray.push(url); }
      }
    });
    this.hardwareBackButton();
  }

  async view_card() {
    const modal = await this.modalController.create({
      component: CardPage,
      componentProps: {
        "user": this.user,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
      }
    });
    return await modal.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.user.autolog()
    });
  }

  hardwareBackButton() {
    this.platform.backButton.subscribe(() => {
      if (this.navLinksArray.length > 1) {
        this.navLinksArray.pop();
        const index = this.navLinksArray.length + 1;
        const url = this.navLinksArray[index];
        this.router.navigate([url]);
      }
    });
  }

}
