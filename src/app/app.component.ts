import { Component, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, MenuController, ModalController, PopoverController, ActionSheetController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Globals } from './globals';
import { User } from './user';
import { Item } from './item';

import { ToastService } from './services/toast/toast.service';

import { CardPage } from './card/card.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private actionSheetController: ActionSheetController,
    private toast: ToastService,
    private router: Router,
    public globals: Globals,
    public user: User,
    public item: Item,
  ) {
    this.initializeApp();
    this.backButtonEvent();
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

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      // close action sheet
      try {
        const element = await this.actionSheetController.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
      }

      // close popover
      try {
        const element = await this.popoverController.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
      }

      // close modal
      try {
        const element = await this.modalController.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
        console.log(error);
      }

      // close side menua
      try {
        const element = await this.menu.getOpen();
        if (element !== null) {
          this.menu.close();
          return;
        }
      } catch (error) {
      }

      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (this.router.url === '/home') {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); // work for ionic 4
          } else {
            this.lastTimeBackPress = new Date().getTime();
            this.toast.present('Press back again to exit App.', 2000)
          }
        }
      });
    });
  }

}
