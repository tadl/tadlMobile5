import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, IonInfiniteScroll, Events, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';
import { ItemDetailPage } from '../item-detail/item-detail.page';

@Component({
  selector: 'app-checkout-history',
  templateUrl: './checkout-history.page.html',
  styleUrls: ['./checkout-history.page.scss'],
})

export class CheckoutHistoryPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  subscription: any;

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    public item: Item,
    private platform: Platform,
    private _location: Location,
    private modalController: ModalController,
  ) { }

  refresh_checkout_history(event) {
    this.user.get_checkout_history(0, event);
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
      this.user.get_checkout_history();
    }
    this.events.subscribe('logged_in', () => {
      this.user.get_checkout_history();
      this.events.unsubscribe('logged_in');
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('logged_in');
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
