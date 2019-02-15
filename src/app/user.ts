import { Globals } from './globals';
import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ActionSheetController, Events, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
})

export class User {
  pages = {};
  constructor(
    public globals: Globals,
    public events: Events,
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
  card: string;
  token: string;
  default_pickup: string;
  login_error: string;
  logout_error: string;
  holds: Array<{any}> = [];
  checkouts: Array<{any}> = [];
  checkout_messages: string;
  checkout_errors: Array<{any}> = [];

  //still need to save username and hashed password to local storage
  login(){
    let params = new HttpParams()
      .set("username", this.username)
      .set("password", this.password)
      .set("v", "5");
    let url = this.globals.catalog_api_host + 'login.json'
    this.http.get(url, {params: params})
      .subscribe(data =>{
        if(data['token']){
          this.logged_in = true
          this.token = data['token']
          this.full_name = data['full_name']
          this.checkout_count = data['checkouts']
          this.holds_count = data['holds']
          this.holds_ready = data['holds_ready']
          this.fines = data['fines']
          this.card = data['card']
          this.overdue = data['overdue']
          this.default_pickup = data['pickup_library']
          this.login_error = ""
          this.logout_error = ""
          this.storage.set('username', this.username);
          this.storage.set('password', this.password);
          this.events.publish('logged_in');
        }else{
          this.login_error = "Invalid username and/or password"
        }
      },
      (err) =>{
        this.login_error = this.globals.server_error_msg
      })
  }

  autolog(){
    this.storage.get('username').then((val) =>{
      this.username = val
      if(typeof this.username != 'undefined' && this.username){
        this.storage.get('password').then((val) =>{
          this.password = val
          this.login()
        })
      }else{
        this.username = ''
      }
    })
  }

  logout(){
    let params = new HttpParams()
      .set("token", this.token)
      .set("v", "5");
    let url = this.globals.catalog_api_host + '/logout.json'
    this.http.get(url, {params: params})
      .subscribe(data =>{
        if(data["success"] || data["error"] == "not logged in or invalid token"){
          this.logged_in = false
          this.username = ''
          this.password = ''
          this.token = ''
          this.full_name = ''
          this.checkout_count = ''
          this.holds_count = ''
          this.holds_ready = ''
          this.fines = ''
          this.card = ''
          this.overdue = ''
          this.default_pickup = ''
          this.holds = []
          this.checkouts = []
          this.storage.clear()
        }
      },
      (err) =>{
        this.logout_error = this.globals.server_error_msg
      })
  }
}
