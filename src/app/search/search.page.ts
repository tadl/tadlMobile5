import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';
import { ToastService } from '../services/toast/toast.service';
import { ItemDetailPage } from '../item-detail/item-detail.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  query: string;
  prev_query: string = "";
  type: string = "keyword";
  sort: string = this.globals.sort_options[0][1];
  format: string = "All Formats";
  location: string = this.globals.all_locations_value;
  page: any;
  audiences: any = "All";
  limit_available: boolean = false
  limit_physical: boolean = false
  results: Array<{any}> = [];
  more_results: boolean;
  infinite: any;
  loading_more: boolean = false;
  subscription: any;

  constructor(
    public globals: Globals,
    public user: User,
    public toast: ToastService,
    public item: Item,
    private http: HttpClient,
    private route: ActivatedRoute,
    private platform: Platform,
    private _location: Location,
    private keyboard: Keyboard,
    private modalController: ModalController,
  ) { }

  get_results(page?) {
    if (!this.query) { return; }
    if (this.type == "keyword") {
      this.sort = this.globals.sort_options[0][1];
    }
    this.keyboard.hide();
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
    if (this.globals.has_audiences == true) {
      params = params.append("audiences", this.audiences);
    }
    var url = this.globals.catalog_search_url;
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.globals.api_loading = false;
        this.prev_query = this.query;
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
          this.toast.present(this.globals.server_error_msg);
        }
      },
      (err) => {
        this.globals.api_loading = false;
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

  async details(item) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: ItemDetailPage,
      componentProps: {
        "item": item,
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
    if (this.route.snapshot) {
      this.query = this.route.snapshot.paramMap.get('query');
      this.get_results();
    }
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
