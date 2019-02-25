import { Globals } from '../globals';
import { User } from '../user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ActionSheetController, Events, ModalController, ToastController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { LoadingService } from '../services/loading/loading.service';
import { ToastService } from '../services/toast/toast.service';

@Component({
  selector: 'app-holds',
  templateUrl: './holds.page.html',
  styleUrls: ['./holds.page.scss'],
})
export class HoldsPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    public loading: LoadingService,
    public toast: ToastService,
    public events: Events,
    private http: HttpClient,
  ) { }

  get_holds(ready = false) {
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("v", "5");
    this.loading.present('Loading Holds...');
    if (ready == true) {
      var url = this.globals.catalog_holds_pickup_url;
    } else {
      var url = this.globals.catalog_holds_url;
    }
    this.http.get(url, {params: params})
      .subscribe(data =>{
        if (data['holds'] && data['user']) {
          this.user.holds = data['holds']
          this.loading.dismiss();
        } else {
          this.loading.dismiss();
          //need to handle when token has expired 
        }
      },
      (err) =>{
        this.loading.dismiss();
        this.toast.present(this.globals.server_error_msg);
      })
  }

  ngOnInit() {
    if (this.user.token) {
      this.get_holds();
    }
    this.events.subscribe('logged_in', () => {
      this.get_holds()
    })
  }

}
