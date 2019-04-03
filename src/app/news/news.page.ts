import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Globals } from '../globals';
import { ToastService } from '../services/toast/toast.service';
import { NewsDetailPage } from '../news-detail/news-detail.page';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})

export class NewsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  url: string = this.globals.news_api_url;
  news: any;
  page: any = 1;
  loading_more: boolean = false;
  infinite: any;
  subscription: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
    private platform: Platform,
    private _location: Location,
  ) { }

  load_more_data(infiniteScroll) {
    this.page++
    this.loading_more = true;
    this.infinite = infiniteScroll;
    this.get_news(this.page);
  }

  get_news(page, refresher?) {
    let params = new HttpParams()
      .set("page", page)
      .set("per_page", "20")
      .set("categories_exclude", this.globals.news_category_exclude)
    this.globals.loading_show();
    this.http.get(this.url, {params: params})
      .subscribe(data => {
        this.globals.api_loading = false;
        if (refresher) { refresher.target.complete(); }
        if (data) {
          if (this.loading_more) {
            this.news.push.apply(this.news, data);
            this.infinite.target.complete();
            this.loading_more = false;
          } else {
            this.news = data;
          }
        } else {
          if (this.loading_more) {
            this.infinite.target.complete();
            this.loading_more = false;
          } else {
          }
          this.toast.present(this.globals.server_error_msg);
        }
      }, (err) => {
        this.globals.api_loading = false;
        if (this.loading_more) {
          this.infinite.target.complete();
          this.infinite.target.disabled = true;
          this.loading_more = false;
        } else {
          this.toast.present(this.globals.server_error_msg);
        }
      });
  }

  refresh_news(event) {
    this.get_news(1, event);
  }

  async view_details(post) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: NewsDetailPage,
      componentProps: {
        "post": post,
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
    this.get_news(this.page);
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
