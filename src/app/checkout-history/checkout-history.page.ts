import { Component, OnInit, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';

import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';

@Component({
  selector: 'app-checkout-history',
  templateUrl: './checkout-history.page.html',
  styleUrls: ['./checkout-history.page.scss'],
})
export class CheckoutHistoryPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    public item: Item,
  ) { }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_checkout_history();
    }
    this.events.subscribe('logged_in', () => {
      this.user.get_checkout_history();
    });
  }

}
