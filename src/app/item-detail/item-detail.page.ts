import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { User } from '../user';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})

export class ItemDetailPage implements OnInit {

  item: any;
  items: string;

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
  ) { }

  ngOnInit() {
    this.items = this.item.availability.copies_all_available > 0 ? 'Available' : 'All Copies';
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

  renew_from_details(){
    this.user.renew(this.item.checkout_id)
    this.events.subscribe('renew_attempt_complete', () => {
      this.item = this.user.checkouts.find( checkout => checkout['id'] == this.item['id']);
      this.events.unsubscribe('renew_attempt_complete');
    });
  }

  place_hold_from_details(need_to_login){
    this.user.place_hold(this.item.id)
    this.events.subscribe('got_holds', () => {
      this.item = this.user.holds.find( hold => hold['id'] == this.item['id']);
      this.events.unsubscribe('got_holds');
   });
  }


  manage_hold_from_details(task){
    this.user.manage_hold(this.item, task)
    this.events.subscribe('manage_hold_complete', () => {
      this.item = this.user.holds.find( hold => hold['id'] == this.item['id']);
      this.events.unsubscribe('manage_hold_complete');
   });
  }

  cancel_hold_from_details(){
    this.user.cancel_hold(this.item)
    this.events.subscribe('manage_hold_complete', () => {
      this.item.hold_id = this.user.holds.find( hold => hold['id'] == this.item['id']);
      this.events.unsubscribe('manage_hold_complete');
   });
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
