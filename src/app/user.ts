import { Globals } from './globals';
import { Component, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';
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

  login(auto = false) {
    if (auto == true ) {
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

/*       format.json {render :json =>{:user => @user, :message => @message, :errors => @errors,
                          :checkouts => @checkouts}}
                          */
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
    this.checkouts.forEach(function(item) { ids.push(item.checkout_id); });
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
          //need to handle when token has expired
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }




}
