import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Globals } from '../globals';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {

  post: any;

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
