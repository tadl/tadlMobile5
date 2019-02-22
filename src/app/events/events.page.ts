import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonInfiniteScroll } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Globals } from '../globals';

import { LoadingService } from '../services/loading/loading.service';
import { ToastService } from '../services/toast/toast.service';

import { EventDetailPage } from '../event-detail/event-detail.page';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})

export class EventsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  url: string = this.globals.events_api_url;
  events: any;
  location: any = '';
  page: any = 1;
  loading_more: boolean = false;
  infinite: any;

  constructor(
    public globals: Globals,
    public loading: LoadingService,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
  ) { }


  load_more_data(infiniteScroll) {
    this.page++;
    this.loading_more = true;
    this.infinite = infiniteScroll;
    this.get_events(this.page, this.location);
  }

  get_events(page, loc?) {
    let params = new HttpParams()
      .set("page", page)
      .set("per_page", "20")
      .set("start_date", "now");
    if (loc) { params.append("venue", loc); }

    this.http.get(this.url, {params: params})
      .subscribe(data => {
        if (data['events']) {
          if (this.loading_more) {
            this.events.push.apply(this.events, data['events']);
            this.infinite.target.complete();
            this.loading_more = false;
            if (!data['next_rest_url']) { this.infinite.target.disabled = true; }
          } else {
            this.events = data['events'];
            this.loading.dismiss();
          }

        } else {
          if (this.loading_more) {
            this.infinite.target.complete();
            this.loading_more = false;
          } else {
            this.loading.dismiss();
          }
          this.toast.present(this.globals.server_error_msg);
        }

      }, (err) => {
        if (this.loading_more) {
          this.infinite.target.complete();
          this.loading_more = false;
        } else {
          this.loading.dismiss();
        }
        this.toast.present(this.globals.server_error_msg);
      });
  }

  async view_details(event) {
    const modal = await this.modalController.create({
      component: EventDetailPage,
      componentProps: {
        "event": event,
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
    this.loading.present('Loading Events...').then(() => {
      this.get_events(this.page, this.location);
    });
  }

}
