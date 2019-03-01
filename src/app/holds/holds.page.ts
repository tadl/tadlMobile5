import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ActionSheetController, Events, ModalController, ToastController } from '@ionic/angular';

import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';

@Component({
  selector: 'app-holds',
  templateUrl: './holds.page.html',
  styleUrls: ['./holds.page.scss'],
})
export class HoldsPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    public item: Item,
    public events: Events,
  ) {
  }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_holds();
    }
    this.events.subscribe('logged_in', () => {
      this.user.get_holds();
    });
  }

}
