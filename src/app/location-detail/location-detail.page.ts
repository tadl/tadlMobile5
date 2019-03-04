import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Globals } from '../globals';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.page.html',
  styleUrls: ['./location-detail.page.scss'],
})
export class LocationDetailPage implements OnInit {

  location: any;

  constructor(
    private modalController: ModalController,
    public globals: Globals,
  ) { }

  ngOnInit() {
  }

  async closeModal() {
    const onClosedData: string = "Wrapped up!";
    await this.modalController.dismiss(onClosedData);
  }
}
