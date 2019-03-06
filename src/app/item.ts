import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ModalController } from '@ionic/angular';

import { Globals } from './globals';

import { LoadingService } from './services/loading/loading.service';
import { ToastService } from './services/toast/toast.service';

import { ItemDetailPage } from './item-detail/item-detail.page';

@Component({
})

export class Item {

  featured: any;
  featured_keys: any = [];

  constructor(
    public modalController: ModalController,
    public globals: Globals,
    public loading: LoadingService,
    public toast: ToastService,
    private http: HttpClient,
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

  get_featured() {
    let params = new HttpParams()
      .set("compact", "true");
    let url = this.globals.catalog_featured_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['featured_items']) {
          this.featured = data['featured_items'];
          this.featured_keys = Object.keys(data['featured_items']);
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

}
