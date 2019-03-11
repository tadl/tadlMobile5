import { Globals } from './globals';
import { Component, ViewChild } from '@angular/core';
import { Events, ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';

import { LoadingService } from './services/loading/loading.service';
import { ToastService } from './services/toast/toast.service';

@Component({
})

export class User {
  constructor(
    public globals: Globals,
    public events: Events,
    public loading: LoadingService,
    public toast: ToastService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public modalController: ModalController,
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
  holds_ready_count: string;
  overdue: string;
  fines_amount: string;
  fines_exist: boolean = false;
  card: string;
  token: string;
  default_pickup: string;
  login_error: string;
  logout_error: string;
  melcat_id: string;
  fines: any;
  action_retry: any;
  holds: Array<{any}> = [];
  holds_ready: Array<{any}> = [];
  checkouts: Array<{any}> = [];
  checkout_history: Array<{any}> = [];
  checkout_history_page: any = 0;
  checkout_history_loading_more: boolean = false;
  checkout_history_infinite: any;
  checkout_history_retrieved: boolean = false;
  greeting: string = this.globals.greetings[Math.floor(Math.random() * this.globals.greetings.length)];

  update_user_object(data) {
    this.logged_in = true;
    this.token = data['token'];
    this.full_name = data['full_name'];
    this.checkout_count = data['checkouts'];
    this.holds_count = data['holds'];
    this.holds_ready_count = data['holds_ready'];
    this.fines_amount = data['fine'];
    if (this.globals.use_melcat == true) { this.melcat_id = data['melcat_id']; }
    if (parseFloat(this.fines_amount) != parseFloat('0.00')) { this.fines_exist = true; }
    this.card = data['card'];
    this.overdue = data['overdue'];
    this.default_pickup = data['pickup_library'];
    console.log(this.token);
  }

  login(auto = false) {
    if (auto == false) {
      this.hashed_password = Md5.hashStr(this.password);
      this.storage.set('hashed_password', this.hashed_password);
    }
    let params = new HttpParams()
      .set("username", this.username)
      .set("md5password", this.hashed_password)
      .set("v", "5");
    let url = this.globals.catalog_login_url;
    this.loading.present('Logging in...');
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['token']) {
          this.update_user_object(data);
          this.login_error = "";
          this.logout_error = "";
          this.storage.set('username', this.username);
          this.loading.dismiss().then(() => {
            this.events.publish('logged_in');
            this.events.publish('ready_to_hold');
            if (this.action_retry == true) {
              this.events.publish('action_retry');
            }
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

  async logout() {
    const actionSheet = await this.actionSheetController.create({
      header: "Please confirm",
      buttons: [{
        text: 'Log Out',
        role: 'destructive',
        handler: () => {
          this.actually_logout();
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('nevermind');
        }
      }]
    });
    await actionSheet.present();
  }

  actually_logout() {
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
          this.holds_ready_count = '';
          this.fines_amount = '';
          this.card = '';
          this.overdue = '';
          this.melcat_id = '';
          this.fines_exist = false;
          this.default_pickup = '';
          this.fines = [];
          this.holds = [];
          this.holds_ready = [];
          this.checkouts = [];
          this.storage.clear();
        }
      },
      (err) => {
        this.logout_error = this.globals.server_error_msg;
      });
  }

  get_more_checkout_history(infiniteScroll) {
    this.checkout_history_page++;
    this.checkout_history_loading_more = true;
    this.checkout_history_infinite = infiniteScroll;
    this.get_checkout_history(this.checkout_history_page);
  }

  get_checkout_history(page?, refresher?) {
    if (!page) { this.checkout_history_page = "0"; }
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5")
      .set("page", this.checkout_history_page);
    let url = this.globals.catalog_checkout_history_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (refresher) { refresher.target.complete(); }
        if (data['user'] && data['checkouts']) {
          if (this.checkout_history_loading_more == true) {
            this.checkout_history.push.apply(this.checkout_history, data['checkouts']);
            this.checkout_history_infinite.target.complete();
            this.checkout_history_loading_more = false;
            if (data['more_results'] == "false") { this.checkout_history_infinite.target.disabled = true; }
          } else {
            this.checkout_history = data['checkouts'];
            this.checkout_history_retrieved = true;
          }
        } else {
          if (this.checkout_history_loading_more == true) {
            this.checkout_history_infinite.target.complete();
            this.checkout_history_loading_more = false;
          } else {
            // TODO token expired
          }
        }
      },
      (err) => {
        if (this.checkout_history_loading_more == true) {
          this.checkout_history_infinite.target.complete();
          this.checkout_history_loading_more = false;
        } else {
        }
        this.toast.present(this.globals.server_error_msg);
      });
  }

  get_fines() {
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
    let url = this.globals.catalog_fines_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data) {
          this.fines = data;
        } else {
          // TODO handle token expired
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

  get_checkouts(refresher = false) {
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
    let url = this.globals.catalog_checkouts_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (refresher) { refresher.target.complete(); }
        if (data['checkouts'] && data['user']) {
          this.checkouts = data['checkouts'];
          this.update_user_object(data['user']);
        }
      },
      (err) => {
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.get_checkouts(refresher);
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
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

  async login_and_place_hold(id) {
    const onClosedData: string = "Wrapped up!";
    await this.modalController.dismiss(onClosedData);
    this.globals.open_account_menu();
    this.events.unsubscribe('ready_to_hold');
    this.events.subscribe('ready_to_hold', () => {
      this.place_hold(id);
      this.events.unsubscribe('ready_to_hold');
    });
  }

  place_hold(id, force?) {
    var params = new HttpParams()
      .set("token", this.token)
      .set("id", id)
      .set("v", "5");
    if (force) { params = params.append("force", "true"); }
    let url = this.globals.catalog_place_hold_url;
    this.loading.present('Placing hold...');
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.loading.dismiss();
        if (data['user'] && data['hold']) {
          if (data['hold']['need_to_force'] == true) {
            this.force_needed(data['hold']['id'], data['hold']['error']);
          } else if (data['hold']['error']) {
            this.toast.present(data['hold']['error'] + ' : ' + data['hold']['confirmation']);
          } else {
            this.toast.present(data['hold']['confirmation'], 5000);
            this.update_user_object(data['user']);
          }
        } else {
          // TODO handle expired token
        }
      },
      (err) => {
        this.loading.dismiss();
        this.toast.present(this.globals.server_error_msg);
      });
  }

  async force_needed(id, error) {
    const alert = await this.alertController.create({
      header: 'Force hold?',
      message: error,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Force Hold',
          handler: () => {
            this.place_hold(id, "true");
          }
        }
      ]
    });
    await alert.present();
  }

  get_holds(ready = false, refresher = false) {
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
        if (refresher) { refresher.target.complete(); }
        if (data['holds'] && data['user']) {
          this.update_user_object(data['user']);
          if (ready == true) {
            this.holds_ready = data['holds'];
          } else {
            this.holds = data['holds'];
          }
        }
      },
      (err) => {
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.get_holds(ready, refresher);
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
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
