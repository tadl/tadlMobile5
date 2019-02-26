import { Globals } from '../globals';
import { User } from '../user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { LoadingService } from '../services/loading/loading.service';
import { ToastService } from '../services/toast/toast.service';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.page.html',
  styleUrls: ['./checkouts.page.scss'],
})
export class CheckoutsPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    public loading: LoadingService,
    public toast: ToastService,
    public events: Events,
    private http: HttpClient,
  ) { 
  }

  get_checkouts() {
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("v", "5");
    var url = this.globals.catalog_checkouts_url;
    this.loading.present('Loading Checkouts...');
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['checkouts'] && data['user']) {
          this.user.checkouts = data['checkouts'];
          this.loading.dismiss();
        } else {
          this.loading.dismiss();
          //need to handle when token has expired
        }
      },
      (err) => {
        this.loading.dismiss();
        this.toast.present(this.globals.server_error_msg);
      });
  }

  ngOnInit() {
    if (this.user.token) {
      this.get_checkouts();
    }

    this.events.subscribe('logged_in', () => {
      this.get_checkouts();
    });

  }

}
