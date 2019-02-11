import { Globals } from './globals';
import { Component, ViewChild } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { AlertController, LoadingController, ActionSheetController, Events, ModalController, ToastController } from '@ionic/angular';


@Component({
  providers: [Http]
})

export class User {
  pages = {};
  constructor(
    private http: Http,
    public globals: Globals,
  ) {
  }
}
