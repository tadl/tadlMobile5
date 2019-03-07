import { Component, OnInit, OnDestroy } from '@angular/core';
import { Events } from '@ionic/angular';

import { Globals } from '../globals';
import { User } from '../user';
import { Item } from '../item';

@Component({
  selector: 'app-holds-ready',
  templateUrl: './holds-ready.page.html',
  styleUrls: ['./holds-ready.page.scss'],
})
export class HoldsReadyPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public item: Item,
    public events: Events,
  ) {
  }

  refresh_holds_ready(event) {
    this.user.get_holds(true, event);
  }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_holds(true);
    }
    this.events.subscribe('logged_in', () => {
      this.user.get_holds(true);
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('logged_in');
  }

}
