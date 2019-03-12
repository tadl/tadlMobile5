import { Component, OnInit, OnDestroy } from '@angular/core';
import { Events } from '@ionic/angular';

import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit, OnDestroy {

  constructor(
    public globals: Globals,
    public user: User,
    public events: Events,
  ) { }

  ngOnInit() {
    if (this.user.token) {
      this.user.get_preferences();
    }
  }

  ngOnDestroy() {
  }

}
