import { Component } from '@angular/core';
import { User } from '../user';
import { Globals } from '../globals';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  constructor(
    public globals: Globals,
    public user: User,
  ) { }

}
