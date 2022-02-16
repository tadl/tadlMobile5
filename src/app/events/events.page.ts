import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Platform, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Globals } from '../globals';
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
  web_events: any;
  location: any = '';
  subscription: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private _location: Location,
    private platform: Platform,
    private http: HttpClient,
  ) { }

  get_events(loc?) {
    let params = new HttpParams()
      .set("ongoing_events", "show")
      .set("start", "12:00am")
      .set("end", "1month");
    if (loc) { params = params.append("branches", loc); }
    this.globals.loading_show();
    this.http.get<any[]>(this.url, {params: params})
      .subscribe(data => {
        this.globals.api_loading = false;
        if (data) {
          data.forEach(function(item, index) {
            if (item['branch']) {
              data[index]['branchid'] = Object.keys(item['branch'])[0];
              data[index]['branchname'] = Object.values(item['branch'])[0];
            }
          });
          this.web_events = data;
        } else {
          this.toast.present(this.globals.server_error_msg);
        }
      }, (err) => {
        this.globals.api_loading = false;
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
    this.get_events(this.location);
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
