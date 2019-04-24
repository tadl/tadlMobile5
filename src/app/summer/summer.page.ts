import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Platform, ModalController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Globals } from '../globals';
import { ToastService } from '../services/toast/toast.service';
import { SummerDetailPage } from '../summer-detail/summer-detail.page';

@Component({
  selector: 'app-summer',
  templateUrl: './summer.page.html',
  styleUrls: ['./summer.page.scss'],
})

export class SummerPage implements OnInit {

  subscription: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private _location: Location,
    private platform: Platform,
    private http: HttpClient,
  ) { }

  async view_details(reader) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: SummerDetailPage,
      componentProps: {
        "reader": reader,
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
