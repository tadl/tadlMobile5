import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Globals } from '../globals';

import { LoadingService } from '../services/loading/loading.service';
import { ToastService } from '../services/toast/toast.service';

import { ModalController } from '@ionic/angular';
import { EventDetailPage } from '../event-detail/event-detail.page';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  url: string = this.globals.events_api_url;
  events: any;
  location: any = '';
  page: any = 1;
  in_progress: boolean = false;

  constructor(
    public globals: Globals,
    public loading: LoadingService,
    public toast: ToastService,
    public modalController: ModalController,
    private http: HttpClient,
  ) { }

  async get_events(page, loc?) {
    this.in_progress = true;

    let params = new HttpParams()
      .set("per_page", "20")
      .set("start_date", "now");

    if (loc) {
      params.append("venue", loc);
    }

    this.http.get(this.url, {params: params})
      .subscribe(data => {
        if (data['events']) {
          this.events = data['events'];
          this.loading.dismiss();
        } else {
          // something really weird happened.
          this.loading.dismiss();
          this.toast.present(this.globals.server_error_msg);
        }
      }, (err) => {
        this.loading.dismiss();
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
      this.get_events(this.page);
    });
  }

}
