import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Globals } from '../globals';

import { LoadingService } from '../services/loading/loading.service';
import { ToastService } from '../services/toast/toast.service';

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
    private http: HttpClient,
    private loading: LoadingService,
    private toast: ToastService,
  ) { }

  get_events(page, loc?) {
    this.in_progress = true;

    let params = { "per_page": "20", "start_date": "now", }
    if (loc) { params.venue = loc; }
    console.log(params);

    this.loading.present('Loading Events...').then(() => {
      this.http.get(this.url, {params: params})
        .subscribe(data => {
          if (data['events']) {
            this.events = data['events'];
            console.log(this.events);
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
    });

  }

  ngOnInit() {
    this.get_events(this.page);
  }

}
