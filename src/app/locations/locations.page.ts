import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
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
    console.log(this.globals.day_today().toLowerCase());
  }

}
