import { Component, ViewChild } from '@angular/core';
import { LoadingController, ModalController} from '@ionic/angular';
import { Globals } from './globals';

@Component({
})

export class Item {

  constructor(
    public globals: Globals,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
  ) {

  }

}
