import { Component } from '@angular/core';
import { Platform, MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../user';
import { Globals } from '../globals';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  constructor(
    public globals: Globals,
    public user: User,
    private alertController: AlertController,
    private menu: MenuController,
    private router: Router,
    private platform: Platform,
  ) { }

  query: string;
  subscription: any;

  search() {
    if (this.query) {
      this.router.navigate(['/search', { query: this.query }]);
    }
  }

  async confirm_exit() {
    const alert = await this.alertController.create({
      header: 'Exit the app?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Exit App',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });
    await alert.present();
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      this.confirm_exit();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
