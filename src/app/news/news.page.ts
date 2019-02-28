import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
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

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
  ) { }

  load_more_data(infiniteScroll) {
    this.page++
    this.loading_more = true;
    this.infinite = infiniteScroll;
    this.get_news(this.page);
  }

  get_news(page) {
    let params = new HttpParams()
      .set("page", page)
      .set("per_page", "20")
      .set("categories_exclude", this.globals.news_category_exclude)
    console.log(params);

    this.http.get(this.url, {params: params})
      .subscribe(data => {
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
        if (this.loading_more) {
          this.infinite.target.complete();
          this.infinite.target.disabled = true;
          this.loading_more = false;
        } else {
          this.toast.present(this.globals.server_error_msg);
        }
      });
  }

  async view_details(post) {
    const modal = await this.modalController.create({
      component: NewsDetailPage,
      componentProps: {
        "post": post,
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
    this.get_news(this.page);
  }

}
