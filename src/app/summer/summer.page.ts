import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Platform, ModalController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Globals } from '../globals';
import { ToastService } from '../services/toast/toast.service';
import { SummerDetailPage } from '../summer-detail/summer-detail.page';
import { User } from '../user';

@Component({
  selector: 'app-summer',
  templateUrl: './summer.page.html',
  styleUrls: ['./summer.page.scss'],
})

export class SummerPage implements OnInit {

  subscription: any;
  participants: Array<{any}> = [];
  show_register: boolean = false;
  shirt_sizes: Array<string> = [
    'Youth Extra Small',
    'Youth Small',
    'Youth Medium',
    'Youth Large',
    'Youth Extra Large',
    'Adult Small',
    'Adult Medium',
    'Adult Large',
    'Adult Extra Large',
    'Adult Double Extra Large',
  ];
  youth_schools: Array<{text: string, value: string}>= [];
  teen_schools: Array<{text: string, value: string}>= [];
  club: string;
  school_type: string;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private _location: Location,
    private platform: Platform,
    private http: HttpClient,
    public user: User,
  ) { }

  async view_details(reader) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: SummerDetailPage,
      componentProps: {
        "reader": reader,
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

  load_participants() {
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("v", "5");
    let url = this.globals.summer_reading_check_participants;
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.participants = data['participants'];
        this.youth_schools = data['youth_schools'];
        this.teen_schools = data['teen_schools'];
        this.youth_schools.shift();
        this.teen_schools.shift();
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
    this.globals.api_loading = false;
  }

  display_register(show) {
    if (show == 'true') {
      this.show_register = true;
    } else {
      this.show_register = false;
    }
  }

  detect_changed_club() {
    this.school_type = '';
  }

  ngOnInit() {
    if (this.user.token) {
      this.load_participants();
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
