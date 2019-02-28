import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
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
  ) { }

  query: string;

  open_account_menu() {
    this.menu.open('right');
  }

  search() {
    console.log(this.query)
    if (this.query) {
      this.router.navigate(['/search', { query: this.query }]);
    }
  }

}
