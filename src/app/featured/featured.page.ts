import { Component, OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


import { Globals } from '../globals';
import { Item } from '../item';
import { User } from '../user';

import { ToastService } from '../services/toast/toast.service';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.page.html',
  styleUrls: ['./featured.page.scss'],
})
export class FeaturedPage implements OnInit {

  results: any;
  search_title: any;

  constructor(
    public globals: Globals,
    public item: Item,
    public user: User,
    public toast: ToastService,
    private http: HttpClient,
  ) {
  }

  featured_search(search, title) {
    search += '&page=0';
    search += '&size=50';
    let params = JSON.parse('{"' + decodeURI(search.replace(/\/search\?/, '')).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    let url = this.globals.catalog_search_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.results = data['results'];
        this.search_title = title;
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

  ngOnInit() {
    this.item.get_featured();
  }

}
