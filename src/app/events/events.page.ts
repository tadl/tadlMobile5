import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Platform, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Globals } from '../globals';

import { ToastService } from '../services/toast/toast.service';
import { LoadingService } from '../services/loading/loading.service';

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
  location_previous: any = '';
  page: any = 1;
  loading_more: boolean = false;
  infinite: any;
  subscription: any;
  some_error: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public loading: LoadingService,
    public modalController: ModalController,
    private _location: Location,
    private platform: Platform,
    private http: HttpClient,
  ) { }

  refresh_events(event) {
    let loc;
    if (this.location) {
      loc = this.location;
    } else {
      loc = null;
    }
    this.get_events(1, loc, event);
    if (this.infinite) {
      this.infinite.target.disabled = false;
    }
  }

  load_more_data(infiniteScroll) {
    if (this.location == this.location_previous) {
      this.page++;
    } else {
      this.page = 2;
      this.location_previous = this.location;
    }
    this.loading_more = true;
    this.infinite = infiniteScroll;
    this.get_events(this.page, this.location);
  }

  get_events(page, loc?, refresher?) {
    let params = new HttpParams()
      .set("page", page)
      .set("per_page", "20")
      .set("start_date", "now");
    if (loc) { params = params.append("venue", loc); }
    if (this.loading_more == false && this.infinite) {
      this.infinite.target.disabled = false;
    }
    this.http.get(this.url, {params: params})
      .subscribe(data => {
        if (refresher) { refresher.target.complete(); }
        if (data['events']) {
          if (this.loading_more) {
            this.events.push.apply(this.events, data['events']);
            this.infinite.target.complete();
            this.loading_more = false;
            if (!data['next_rest_url']) { this.infinite.target.disabled = true; }
          } else {
            this.events = data['events'];
          }
        } else {
          if (this.loading_more) {
            this.infinite.target.complete();
            this.loading_more = false;
          } else {
            this.some_error = "IF FAILED: ";
            this.some_error += JSON.stringify(data);
          }
          this.toast.present(this.globals.server_error_msg);
        }
      }, (err) => {
        if (this.infinite) {
          this.infinite.target.complete();
          this.infinite.target.disabled = true;
          this.loading_more = false;
        } else {
          this.some_error = "ERROR: ";
          this.some_error += JSON.stringify(err);
        }
        this.toast.present(this.globals.server_error_msg);
      });
  }

  async view_details(event) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: EventDetailPage,
      componentProps: {
        "event": event,
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
    this.get_events(this.page, this.location);
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
