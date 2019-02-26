import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Globals } from '../globals';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

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
