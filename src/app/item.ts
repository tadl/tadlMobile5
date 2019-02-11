import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController, ModalController} from '@ionic/angular';
import { Globals } from './globals';

@Component({
  providers: [Http]
})

export class Item {

  constructor(
    private http: Http,
    public globals: Globals,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
  ) {
  }

}
