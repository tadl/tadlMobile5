import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, Events, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';
import { ItemDetailPage } from '../item-detail/item-detail.page';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.page.html',
  styleUrls: ['./checkouts.page.scss'],
})
export class CheckoutsPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    public item: Item,
    private platform: Platform,
    private _location: Location,
    private modalController: ModalController,
  ) { }

  subscription: any;

  refresh_checkouts(event) {
    this.user.get_checkouts(event);
  }

  async details(item) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: ItemDetailPage,
      componentProps: {
        "item": item,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
        this.subscription = this.platform.backButton.subscribe(() => {
          this._location.back();
        });
      }
    });
    return await modal.present();
  }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_checkouts();
    }
  }

  ngOnDestroy() {
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      this._location.back();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
