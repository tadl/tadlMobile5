import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, ModalController, Events } from '@ionic/angular';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';
import { ItemDetailPage } from '../item-detail/item-detail.page';

@Component({
  selector: 'app-holds',
  templateUrl: './holds.page.html',
  styleUrls: ['./holds.page.scss'],
})
export class HoldsPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public item: Item,
    public events: Events,
    private platform: Platform,
    private _location: Location,
    private modalController: ModalController,
  ) { }

  subscription: any;

  refresh_holds(event) {
    this.user.get_holds(false, event);
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
      this.user.get_holds();
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
