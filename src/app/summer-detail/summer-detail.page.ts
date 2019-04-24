import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';

@Component({
  selector: 'app-summer-detail',
  templateUrl: './summer-detail.page.html',
  styleUrls: ['./summer-detail.page.scss'],
})

export class SummerDetailPage implements OnInit {

  reader: any;

  constructor(
    public globals: Globals,
  ) { }

  ngOnInit() {
  }

}
