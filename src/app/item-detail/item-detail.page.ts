import { Component, OnInit } from '@angular/core';
import { Events, ModalController, MenuController } from '@ionic/angular';

import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {

  item: any;
  items: string;

  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    public events: Events,
    public globals: Globals,
    public user: User,
  ) { }

  ngOnInit() {
    this.items = this.item.availability.copies_all_available > 0 ? 'Available' : 'All Copies';
  }

  async login_and_place_hold(id) {
    const onClosedData: string = "Wrapped up!";
    await this.modalController.dismiss(onClosedData);
    this.globals.open_account_menu();
    this.events.subscribe('logged_in', () => {
      this.user.place_hold(id)
    });
  }

  showContents(item) {
    var output = '';
    if (item.contents_array[1] == null) {
      output = item.contents;
    } else {
      output = item.contents_array.join('</p><p>');
    }
    return output;
  }

  showAbstract(item) {
    var output = '';
    if (item.abstract_array[1] == null) {
      output = item.abstract;
    } else {
      output = item.abstract_array.join('</p><p>');
    }
    return output;
  }

}
