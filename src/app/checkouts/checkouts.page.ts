import { Globals } from '../globals';
import { User } from '../user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ActionSheetController, Events, ModalController, ToastController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-checkouts',
  templateUrl: './checkouts.page.html',
  styleUrls: ['./checkouts.page.scss'],
})
export class CheckoutsPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    private http: HttpClient,
  ) { }

  get_checkouts() {
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("v", "5");
    var url = this.globals.catalog_api_host + 'checkouts.json'
    this.http.get(url, {params: params})
      .subscribe(data =>{
        if (data['checkouts'] && data['user']) {
          this.user.checkouts = data['checkouts']
          this.user.checkouts.forEach(function (h) {
            h['cover'] = "https://catalog.tadl.org/opac/extras/ac/jacket/medium/r/" + h['id'].toString()
          });
        } else {
          //need to handle when token has expired
        }
      },
      (err) =>{
        //need to handle with a generic server error toast
      })
  }
  ngOnInit() {
    if (this.user.token) {
      this.get_checkouts();
    } else {
      console.log('viewing a page you cannot view unless logged in');
    }
    this.events.subscribe('logged_in', () => {
      this.get_holds()
    })
  }

}
