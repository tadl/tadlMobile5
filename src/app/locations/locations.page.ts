import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Globals } from '../globals';

import { ToastService } from '../services/toast/toast.service';

import { LocationDetailPage } from '../location-detail/location-detail.page';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

  url: string = this.globals.hours_locations_url;
  locations: any;
  subscription: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
    private platform: Platform,
    private _location: Location,
  ) { }

  get_locations() {
    this.http.get(this.url)
      .subscribe(data => {
        if (data['locations']) {
          this.locations = data['locations'];
        } else {
          this.toast.present(this.globals.server_error_msg);
        }
      }, (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

  async view_details(location) {
    const modal = await this.modalController.create({
      component: LocationDetailPage,
      componentProps: {
        "location": location,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
      }
    });
    return await modal.present();
  }

  ngOnInit() {
    this.get_locations();
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
