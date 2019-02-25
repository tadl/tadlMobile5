import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Globals } from '../globals';

import { LoadingService } from '../services/loading/loading.service';
import { ToastService } from '../services/toast/toast.service';

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
    public loading: LoadingService,
    public toast: ToastService,
    private http: HttpClient,
  ) { }

  get_locations() {

    this.http.get(this.url)
      .subscribe(data => {
        if (data['locations']) {
          this.locations = data['locations'];
          this.loading.dismiss();
        } else {
          this.toast.present(this.globals.server_error_msg);
          this.loading.dismiss();
        }
      }, (err) => {
        this.toast.present(this.globals.server_error_msg);
        this.loading.dismiss();
      });

  }

  ngOnInit() {
    this.loading.present('Loading...').then(() => {
      this.get_locations();
    });
  }

}
