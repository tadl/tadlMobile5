import { Component, OnInit, OnDestroy } from '@angular/core';
import { Events, ActionSheetController, AlertController } from '@ionic/angular';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private http: HttpClient,
  ) { }

  /* parameters.circ_prefs_changed = true;

     parameters.pickup_library = pickup_library;
     parameters.default_search = default_search;
     parameters.keep_circ_history = keep_circ_history;
   */
  async update_hold_pickup_location(event) {
    let new_pickup_library = event.detail.value;
    let params = new HttpParams()
      .set("circ_prefs_changed", "true")
      .set("pickup_library", new_pickup_library)
      .set("v", "5");
    console.log(params);
  }
  async update_default_search_location(event) {
    let new_search_location = event.detail.value;
    let params = new HttpParams()
      .set("circ_prefs_changed", "true")
      .set("default_search", new_search_location)
      .set("v", "5");
    console.log(params);
  }
  async toggle_circ_history(event) { // ActionSheet
    if (event.detail.checked == false) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Warning! Turning off your checkout history will delete your existing history. It can not be recovered.',
        buttons: [{
          text: 'Delete Checkout History',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.update_circ_history(event.detail.checked);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.user.preferences.keep_circ_history = true;
          }
        }]
      });
      await actionSheet.present();
    } else {
      this.update_circ_history(event.detail.checked);
    }
  }
  update_circ_history(val) {
    let params = new HttpParams()
      .set("keep_circ_history", val.toString())
      .set("circ_prefs_changed", "true")
      .set("v", "5");
    console.log(params);
  }

  /* parameters.user_prefs_changed = true;

     parameters.username_changed = true;
     parameters.username
     parameters.current_password

     parameters.hold_shelf_alias_changed = true;
     parameters.hold_shelf_alias
     parameters.current_password

     parameters.email_changed = true;
     parameters.email
     parameters.current_password
   */
  async change_username() { // Alert
    const alert = await this.alertController.create({
      header: 'Change Username',
      message: 'Enter your desired new username along with your current password to change your username.',
      inputs: [{
        name: 'username',
        type: 'text',
        placeholder: 'New Username',
      }, {
        name: 'current_password',
        type: 'password',
        placeholder: 'Current Password',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (params) => {
          console.log(params);
        }
      }]
    });
    await alert.present();

  }
  async change_alias() { // Alert
    const alert = await this.alertController.create({
      header: 'Change Holdshelf Alias',
      message: 'Enter a new holdshelf alias along with your current password to change your holdshelf alias.',
      inputs: [{
        name: 'hold_shelf_alias',
        type: 'text',
        placeholder: 'New Holdshelf Alias',
      }, {
        name: 'current_password',
        type: 'password',
        placeholder: 'Current Password',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (params) => {
          console.log(params);
        }
      }]
    });
    await alert.present();
  }
  async change_email() { // Alert
    const alert = await this.alertController.create({
      header: 'Change Email Address',
      message: 'Enter your new email address along with your current password to change your email address.',
      inputs: [{
        name: 'email',
        type: 'email',
        placeholder: 'Email Address',
      }, {
        name: 'current_password',
        type: 'password',
        placeholder: 'Current Password',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (params) => {
          console.log(params);
        }
      }]
    });
    await alert.present();
  }
  async change_password() { // Alert
    const alert = await this.alertController.create({
      header: 'Change Password',
      message: 'Enter your new password (twice) along with your current password to change your password.',
      inputs: [{
        name: 'new_password1',
        type: 'password',
        placeholder: 'New Password',
      }, {
        name: 'new_password2',
        type: 'password',
        placeholder: 'New Password Again',
      }, {
        name: 'current_password',
        type: 'password',
        placeholder: 'Current Password',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: (params) => {
          console.log(params);
        }
      }]
    });
    await alert.present();
  }

  /* parameters.notify_prefs_changed = true;

     parameters.phone_notify_number
     parameters.text_notify_number
     parameters.email_notify
     parameters.phone_notify
     parameters.text_notify
   */
  async update_phone_notify_number() { // Alert
  }
  async update_text_notify_number() { // Alert
  }
  async toggle_notify_method(method) { // just do it
    console.log(method);
  }


  ngOnInit() {
    if (this.user.token) {
      this.user.get_preferences();
    }
  }

  ngOnDestroy() {
  }

}
