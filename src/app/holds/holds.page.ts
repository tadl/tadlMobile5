import { Globals } from '../globals';
import { User } from '../user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ActionSheetController, Events, ModalController, ToastController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-holds',
  templateUrl: './holds.page.html',
  styleUrls: ['./holds.page.scss'],
})
export class HoldsPage implements OnInit {

  constructor(
    public globals: Globals,
    public user: User,
    private http: HttpClient,
    public events: Events,
  ) { }


  get_holds(ready = false){
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("v", "5");
    if(ready == true){
      var url = this.globals.catalog_api_host + 'holds_pickup.json'
    }else{
      var url = this.globals.catalog_api_host + 'holds.json'
    }
    this.http.get(url, {params: params})
      .subscribe(data =>{
        if(data['holds'] && data['user']){
          this.user.holds = data['holds']
          this.user.holds.forEach(function (h){
            h['cover'] = "https://catalog.tadl.org/opac/extras/ac/jacket/medium/r/" + h['id'].toString()
          });
        }else{
          //need to handle when token has expired 
        }
      },
      (err) =>{
        //need to handle with a generic server error toast
      })
  }


  ngOnInit() {
    if(this.user.token && this.user.token != ''){
      this.get_holds()
    }
    this.events.subscribe('logged_in', () => {
      this.get_holds()
    })

  }

}
