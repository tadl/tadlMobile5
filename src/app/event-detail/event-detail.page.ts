import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  event: any;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    console.log(this.event);
  }

  async closeModal() {
    const onClosedData: string = "Wrapped up!";
    await this.modalController.dismiss(onClosedData);
  }

}
