import { Globals } from './globals';
import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ActionSheetController, Events, ModalController, ToastController } from '@ionic/angular';


@Component({
})

export class User {
  pages = {};
  constructor(
    public globals: Globals,
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
  overduue: string;
  fines: string;
  card: string;
  token: string;
  default_pickup: string;
  login_error: string;
  holds: Array<{any}> = [];
  checkouts: Array<{any}> = [];
  checkout_messages: string;
  checkout_errors: Array<{any}> = [];


}
