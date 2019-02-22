import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Globals } from '../globals';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  event: any;

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
