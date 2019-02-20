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
    private http: HttpClient,
    private loading: LoadingService,
    private toast: ToastService,
    public events: Events,
  ) { }

  get_checkouts() {
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("v", "5");
    this.loading.present('Loading Checkouts...');
    var url = this.globals.catalog_api_host + 'checkouts.json';
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['checkouts'] && data['user']) {
          this.user.checkouts = data['checkouts'];
          this.user.checkouts.forEach(function (h) {
            h['cover'] = "https://catalog.tadl.org/opac/extras/ac/jacket/medium/r/" + h['id'].toString();
          });
          this.loading.dismiss();
        } else {
          this.loading.dismiss();
          //need to handle when token has expired
        }
      },
      (err) => {
        this.loading.dismiss();
        this.toast.present(this.globals.server_error_msg);
      })
  }

  ngOnInit() {
    if (this.user.token) {
      this.get_checkouts();
    } else {
      console.log('viewing a page you cannot view unless logged in');
    }
    this.events.subscribe('logged_in', () => {
      this.get_checkouts();
    });
  }

}
