import { Component, ViewChild, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Platform, MenuController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Globals } from './globals';
import { User } from './user';
import { Item } from './item';
import { CardPage } from './card/card.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, AfterContentChecked {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private modalController: ModalController,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private network: Network,
    public globals: Globals,
    public user: User,
    public item: Item,
  ) {
    this.initializeApp();
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
      this.statusBar.overlaysWebView(false);
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#33000000');
      }
      if (this.platform.is('ios')) {
        this.statusBar.styleDefault();
      }
      this.platform.resume.subscribe((result) => {
        this.user.autolog();
      });
      if (this.platform.is('cordova')) {
        let disconnect_subscribe = this.network.onDisconnect().subscribe(() => {
          this.globals.net_status = "offline";
        });
        let connect_subscribe = this.network.onConnect().subscribe(() => {
          this.globals.net_status = "online";
          setTimeout(() => {
            this.globals.net_type = this.network.type;
          }, 3000);
        });
        setTimeout(() => {
          if (this.network.type == "none") {
            this.globals.net_status = "offline";
          } else {
            this.globals.net_status = "online";
          }
        }, 3000);
      }
      this.splashScreen.hide();
      this.statusBar.show();
      this.user.autolog();
      this.user.update_stored_accounts();
    });
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  ngOnInit() {
  }

}
