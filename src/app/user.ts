import { Globals } from './globals';
import { Component, ViewChild } from '@angular/core';
import { Events, ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { format, formatDistance, parseISO, isBefore, isAfter } from 'date-fns';
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
  melcat_id: string;
  fines: any;
  action_retry: any;
  preferences: any;
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
  }

  login(auto = false) {
    if (auto == false) {
      if (!this.username || !this.password) {
        this.toast.present("Username and password are required.", 5000);
        return;
      }
      this.hashed_password = Md5.hashStr(this.password);
      this.storage.set('hashed_password', this.hashed_password);
    }
    let params = new HttpParams()
      .set("username", this.username)
      .set("md5password", this.hashed_password)
      .set("full", "true")
      .set("v", "5");
    let url = this.globals.catalog_login_url;
    this.loading.present('Logging in...');
    this.http.get(url, {params: params})
      .subscribe(data => {
        console.log(data);
        if (data['user']) {
          this.update_user_object(data['user']);
          if (JSON.stringify(this.holds) != JSON.stringify(data['holds'])) {
            this.holds = data['holds'];
          }
          this.process_checkouts(data['checkouts']);
          this.preferences = data['preferences'];
          this.storage.set('username', this.username);
          if (data['user']['holds_ready'] > 0) {
            let items_ready = [];
            this.holds.forEach(function(item) {
              if (item['queue_status'].indexOf("Ready for Pickup") !== -1) {
                items_ready.push(item['id']);
              }
            });
            let items_ready_str = items_ready.join();
            this.storage.get('items_ready').then((items) => {
              if (items_ready_str != items) {
                this.storage.set('items_ready', items_ready_str);
                this.toast.present("You have one or more items available for pickup. View your holds for details.");
              }
            });
          }
          if (data['user']['overdue'] > 0) {
            let items_overdue = [];
            this.checkouts.forEach(function(item) {
              var due_date = new Date(item['due_date']);
              if (isBefore(due_date, new Date())) {
                items_overdue.push(item['id']);
              }
            });
            let items_overdue_str = items_overdue.join();
            this.storage.get('items_overdue').then((items) => {
              if (items_overdue_str != items) {
                this.storage.set('items_overdue', items_overdue_str);
                this.toast.present("You have one or more items overdue. View your checkouts for details.");
              }
            });
          }
          this.loading.dismiss().then(() => {
            this.events.publish('ready_to_hold');
            this.events.publish('logged_in');
            if (this.action_retry == true) {
              this.events.publish('action_retry');
            }
          });
        } else {
          this.loading.dismiss();
          this.toast.present("Username or password were incorrect. Please try again.", 5000);
        }
      },
      (err) => {
        this.loading.dismiss();
        this.toast.present(this.globals.server_error_msg);
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
        this.toast.present(this.globals.server_error_msg);
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
        }
      },
      (err) => {
        if (this.checkout_history_loading_more == true) {
          this.checkout_history_infinite.target.complete();
          this.checkout_history_loading_more = false;
        }
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.get_checkout_history(page, refresher);
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
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
        }
      },
      (err) => {
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.get_fines();
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
      });
  }

  get_preferences() {
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
    let url = this.globals.catalog_preferences_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data) {
          this.update_user_object(data['user']);
          this.preferences = data['preferences'];
        }
      },
      (err) => {
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.action_retry = false;
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
      });
  }

  update_preferences(params) {
    this.loading.present("Updating...");
    let url = this.globals.catalog_update_preferences_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.loading.dismiss();
        this.update_user_object(data['user']);
        this.preferences = data['preferences'];
      },
      (err) => {
        this.loading.dismiss();
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.update_preferences(params);
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
      });
  }

  process_checkouts(data) {
    let date_today = new Date().toISOString().split("T")[0];
    data.forEach(function(checkout, index) {
      if (isBefore(new Date(checkout['due_date']), parseISO(date_today))) {
        data[index]['overdue'] = true;
        data[index]['due_words'] = formatDistance(new Date(checkout['due_date']), parseISO(date_today)) + ' ago';
      } else {
        data[index]['overdue'] = false;
        data[index]['due_words'] = 'in ' + formatDistance(new Date(checkout['due_date']), parseISO(date_today));
      }
    });
    if (JSON.stringify(this.checkouts) != JSON.stringify(data)) {
      this.checkouts = data;
    }
  }

  get_checkouts(refresher?) {
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
    let url = this.globals.catalog_checkouts_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (refresher) { refresher.target.complete(); }
        if (data['checkouts'] && data['user']) {
          this.process_checkouts(data['checkouts']);
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
            this.action_retry = false;
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
          this.process_checkouts(data['checkouts']);
          this.toast.present(data['message']);
        } else if (data['checkouts'] && data['user']) {
          this.process_checkouts(data['checkouts']);
          let message = data['message'] + ': ';
          data['errors'].forEach(function(val) {
            message += val['title'] + ': ' + val['message'];
          });
          this.toast.present(message);
        }
      },
      (err) => {
        this.loading.dismiss();
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.renew(cid);
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
      });
  }

  renew_all() {
    this.renew(this.checkouts.filter(item => item['renew_attempts'] > 0).map(item => item['checkout_id']).join());
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
        }
      },
      (err) => {
        if (this.action_retry == true) {
          this.loading.dismiss();
          this.toast.present(this.globals.server_error_msg);
        } else {
          this.loading.dismiss();
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.place_hold(id);
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
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

  get_holds(ready = false, refresher?) {
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
            if (JSON.stringify(this.holds) != JSON.stringify(data['holds'])) {
              this.holds = data['holds'];
            }
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
            this.action_retry = false;
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
        }
      },
      (err) => {
        this.loading.dismiss();
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.manage_hold(hold, task);
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
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
        }
      },
      (err) => {
        if (this.action_retry == true) {
          this.toast.present(this.globals.server_error_msg);
          this.action_retry = false;
        } else {
          this.action_retry = true;
          this.events.subscribe('action_retry', () => {
            this.change_hold_pickup(hold, newloc);
            this.events.unsubscribe('action_retry');
          });
          this.login(true);
        }
      });
  }

}
