import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Platform, ModalController, Events } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Globals } from '../globals';
import { User } from '../user';

@Component({
  selector: 'app-summer',
  templateUrl: './summer.page.html',
  styleUrls: ['./summer.page.scss'],
})
export class SummerPage implements OnInit {

  constructor() { 
    public user: User,
  }

  load_participants(){
  }

  ngOnInit() {
    if (this.user.token) {
      this.load_participants();
    }
  }

}
