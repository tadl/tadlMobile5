import { Globals } from './globals';
import { Component, ViewChild } from '@angular/core';
import { Events, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';

import { LoadingService } from './services/loading/loading.service';
import { ToastService } from './services/toast/toast.service';

@Component({
})

export class User {
  pages = {};
  constructor(
    public globals: Globals,
    public events: Events,
    public loading: LoadingService,
    public toast: ToastService,
    public actionSheetController: ActionSheetController,
    private http: HttpClient,
    private storage: Storage,
  ) {
  }

  username: string;
  password: any = ''
  hashed_password: any = ''
  logged_in: boolean = false;
  full_name: string;
  ils_username: string;
  checkout_count: string;
  holds_count: string;
  holds_ready: string;
  overdue: string;
  fines: string;
  fines_exist: boolean = false;
  card: string;
  token: string;
  default_pickup: string;
  login_error: string;
  logout_error: string;
  melcat_id: string;
  holds: Array<{any}> = [];
  checkouts: Array<{any}> = [];
  greeting: string = this.globals.greetings[Math.floor(Math.random() * this.globals.greetings.length)];

  update_user_object(data) {
    this.logged_in = true;
    this.token = data['token'];
    this.full_name = data['full_name'];
    this.checkout_count = data['checkouts'];
    this.holds_count = data['holds'];
    this.holds_ready = data['holds_ready'];
    this.fines = data['fines'];
    if (this.globals.use_melcat == true) { this.melcat_id = data['melcat_id']; }
    if (parseFloat(this.fines) == parseFloat('0.00')) { this.fines_exist = true; }
    this.card = data['card'];
    this.overdue = data['overdue'];
    this.default_pickup = data['pickup_library'];
  }

  login(auto = false) {
    if (auto == true) {
      var params = new HttpParams()
        .set("username", this.username)
        .set("md5password", this.hashed_password)
        .set("v", "5");
    } else {
      var params = new HttpParams()
        .set("username", this.username)
        .set("password", this.password)
        .set("v", "5");
    }
    let url = this.globals.catalog_login_url;
    this.loading.present('Logging in...');
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['token']) {
          this.update_user_object(data);
          this.login_error = "";
          this.logout_error = "";
          this.storage.set('username', this.username);
          if (auto == false) {
            this.storage.set('hashed_password', Md5.hashStr(this.password));
          }
          this.loading.dismiss().then(() => {
            this.events.publish('logged_in');
          });
        } else {
          this.loading.dismiss();
          this.toast.present("Invalid username and/or password");
        }
      },
      (err) => {
        this.loading.dismiss();
        this.login_error = this.globals.server_error_msg;
      });
  }

  autolog() {
    this.storage.get('username').then((val) => {
      this.username = val;
      if (typeof this.username != 'undefined' && this.username) {
        this.storage.get('hashed_password').then((val) => {
          this.hashed_password = val;
          this.login(true);
        });
      } else {
        this.username = '';
      }
    });
  }

  logout() {
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
    let url = this.globals.catalog_logout_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data["success"] || data["error"] == "not logged in or invalid token") {
          this.logged_in = false;
          this.username = '';
          this.password = '';
          this.token = '';
          this.full_name = '';
          this.checkout_count = '';
          this.holds_count = '';
          this.holds_ready = '';
          this.fines = '';
          this.card = '';
          this.overdue = '';
          this.default_pickup = '';
          this.holds = [];
          this.checkouts = [];
          this.storage.clear();
        }
      },
      (err) => {
        this.logout_error = this.globals.server_error_msg;
      });
  }

  get_checkouts() {
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
    let url = this.globals.catalog_checkouts_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['checkouts'] && data['user']) {
          this.checkouts = data['checkouts'];
        } else {
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

  renew(cid) {
    let url = this.globals.catalog_renew_url;
    let params = new HttpParams()
      .set("token", this.token)
      .set("checkout_ids", cid)
      .set("v", "5");
    this.loading.present('Renewing...');
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.loading.dismiss();
        if (data['errors'].length == 0 && data['checkouts'] && data['user']) {
          this.checkouts = data['checkouts'];
          this.toast.present(data['message']);
        } else if (data['checkouts'] && data['user']) {
          this.checkouts = data['checkouts'];
          let message = data['message'] + ': ';
          data['errors'].forEach(function(val) {
            message += val['title'] + ': ' + val['message'];
          });
          this.toast.present(message);

        } else {
          // TODO token is expired
        }
      });
  }

  renew_all() {
    let url = this.globals.catalog_renew_url;
    let ids = [];
    this.checkouts.forEach(function(item) { ids.push(item['checkout_id']); });
    this.renew(ids.join());
  }

  place_hold(id) {
  }

  get_holds(ready = false) {
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
    if (ready == true) {
      var url = this.globals.catalog_holds_pickup_url;
    } else {
      var url = this.globals.catalog_holds_url;
    }
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['holds'] && data['user']) {
          this.holds = data['holds'];
        } else {
          // TODO need to handle when token has expired
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

  manage_hold(hold, task) {
    let url = this.globals.catalog_holds_manage_url;
    let params = new HttpParams()
      .set("token", this.token)
      .set("hold_id", hold.hold_id)
      .set("task", task)
      .set("v", "5");
    if (task == "activate") { var action = "activated"; }
    else if (task == "suspend") { var action = "suspended"; }
    else if (task == "cancel") { var action = "canceled"; }
    this.loading.present('One moment...');
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.loading.dismiss();
        if (data['holds'] && data['user']) {
          this.holds = data['holds'];
          this.update_user_object(data['user']);
          this.toast.present("Successfully " + action + " hold on " + hold.title_display + ".", 5000);
        } else {
          // TODO handle expired token
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

  async cancel_hold(hold) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cancel hold on ' + hold.title_display,
      buttons: [{
        text: 'Cancel Hold',
        role: 'destructive',
        handler: () => {
          this.manage_hold(hold, 'cancel');
        }
      }, {
        text: 'Nevermind',
        role: 'cancel',
        handler: () => {
          console.log('nevermind');
        }
      }]
    });
    await actionSheet.present();
  }

  change_hold_pickup(hold, newloc) {
    let url = this.globals.catalog_change_hold_pickup_url;
    let params = new HttpParams()
      .set("token", this.token)
      .set("hold_id", hold.hold_id)
      .set("hold_status", hold.hold_status)
      .set("pickup_location", newloc.detail.value)
      .set("v", "5");
    this.loading.present("Changing pickup location...");
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.loading.dismiss();
        if (data['hold_id'] == hold.hold_id) {
          this.holds.find(item => item['hold_id'] == data['hold_id'])['pickup_location'] = data['pickup_location'];
          this.toast.present('Changed pickup location for ' + hold.title_display + ' to ' + data['pickup_location'], 5000);
        } else {
          // TODO handle expired token
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

}
