import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  id: string;
  title: string;
  description: string;
  start_date: string;
  venue: string;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    console.table(this.navParams);
    this.id = this.navParams.data.id;
    this.title = this.navParams.data.title;
    this.description = this.navParams.data.description;
    this.start_date = this.navParams.data.start_date;
    this.venue = this.navParams.data.venue;
  }

  async closeModal() {
    const onClosedData: string = "Wrapped up!";
    await this.modalController.dismiss(onClosedData);
  }

}
