import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Globals } from './globals';

import { LoadingService } from './services/loading/loading.service';
import { ToastService } from './services/toast/toast.service';

import { ItemDetailPage } from './item-detail/item-detail.page';

@Component({
})

export class Item {

  constructor(
    public modalController: ModalController,
    public globals: Globals,
    public loading: LoadingService,
    public toast: ToastService,
  ) { }

  async details(item) {
    const modal = await this.modalController.create({
      component: ItemDetailPage,
      componentProps: {
        "item": item,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
      }
    });
    return await modal.present();
  }

}
