import { Component, OnInit } from '@angular/core';

import { Globals } from '../globals';
import { Item } from '../item';
import { User } from '../user';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.page.html',
  styleUrls: ['./featured.page.scss'],
})
export class FeaturedPage implements OnInit {

  constructor(
    public globals: Globals,
    public item: Item,
    public user: User,
  ) { }

  ngOnInit() {
    if (!this.item.featured) {
      this.item.get_featured();
    }
  }

}
