import { Component } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
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

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }
  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
