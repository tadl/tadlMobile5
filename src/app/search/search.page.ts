import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
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
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public globals: Globals,
    public user: User,
    public loading: LoadingService,
    public toast: ToastService,
    public item: Item,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  query: string;
  prev_query: string = "";
  type: string = "keyword";
  sort: string = this.globals.sort_options[0][1];
  format: string = "All Formats";
  location: string = this.globals.all_locations_value;
  page: any;
  limit_available: boolean = false
  limit_physical: boolean = false
  results: Array<{any}> = [];
  more_results: boolean;
  infinite: any;
  loading_more: boolean = false;

  get_results(page?) {
    if (!this.query) { return; }
    if (!page || this.query != this.prev_query) {
      this.page = 0;
      if (this.infinite && this.infinite.target.disabled == true) {
        this.infinite.target.disabled = false;
      }
    }
    let params = new HttpParams()
      .set("v", "5")
      .set("type", this.type)
      .set("query", this.query)
      .set("location", this.location)
      .set("sort", this.sort)
      .set("page", this.page)
      .set("limit_physical", this.limit_physical.toString())
      .set("limit_available", this.limit_available.toString())
      .set("fmt", this.format);
    var url = this.globals.catalog_search_url;
    this.prev_query = this.query;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['results']) {
          if (data['type']) { this.type = data['type']; }
          if (this.loading_more == true) {
            this.results.push.apply(this.results, data['results']);
            this.infinite.target.complete();
            this.loading_more = false;
            if (data['more_results'] == false) { this.infinite.target.disabled = true; }
          } else {
            this.results = data['results'];
          }
        } else {
          if (this.loading_more == true) {
            this.infinite.target.complete();
            this.loading_more = false;
          } else {
          }
          // TODO: need to handle when token has expired (but actually token isn't required for this)
        }
      },
      (err) => {
        if (this.loading_more == true) {
          this.infinite.target.complete();
          this.loading_more = false;
        } else {
        }
        this.toast.present(this.globals.server_error_msg);
      });
  }

  detect_search_option() {
    if (this.query) {
      this.get_results();
    }
  }

  get_more_results(infiniteScroll) {
    this.page++;
    this.loading_more = true;
    this.infinite = infiniteScroll;
    this.get_results(this.page);
  }

  ngOnInit() {
    if (this.route.snapshot) {
      this.query = this.route.snapshot.paramMap.get('query');
      this.get_results();
    }
  }

}
