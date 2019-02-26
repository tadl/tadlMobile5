import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {

  item: any;

  constructor(
    private modalController: ModalController,
    public globals: Globals,
    public user: User,
  ) { }

  ngOnInit() {
  }

  async closeModal() {
    const onClosedData: string = "Wrapped up!";
    await this.modalController.dismiss(onClosedData);
  }

}
