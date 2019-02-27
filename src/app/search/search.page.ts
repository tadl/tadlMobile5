import { Component, OnInit, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { LoadingService } from '../services/loading/loading.service';
import { ToastService } from '../services/toast/toast.service';

import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    public loading: LoadingService,
    public toast: ToastService,
    public events: Events,
    public item: Item,
    private http: HttpClient,
  ) { }

  query: string;
  type: string = "keyword";
  sort: string;
  fmt: string;
  location: string;
  page: string;
  view: string;
  more_results: boolean;
  size: number;
  results: Array<{any}> = [];

  get_results() {
    let params = new HttpParams()
      .set("v", "5")
      .set("type", this.type)
      .set("query", this.query);
    var url = this.globals.catalog_search_url;
    this.http.get(url, {params: params})
    .subscribe(data => {
        if (data['results']) {
          this.results = data['results'];
          this.more_results = data['more_results'];
          if (data['type']) {
            this.type = data['type'];
          }
        } else {
          //need to handle when token has expired
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

  ngOnInit() {
  }

}
