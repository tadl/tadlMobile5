import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Platform, ModalController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Globals } from '../globals';
import { ToastService } from '../services/toast/toast.service';
import { SummerDetailPage } from '../summer-detail/summer-detail.page';
import { User } from '../user';

@Component({
  selector: 'app-summer',
  templateUrl: './summer.page.html',
  styleUrls: ['./summer.page.scss'],
})

export class SummerPage implements OnInit {

  subscription: any;
  participants: Array<{any}> = [];
  show_register: boolean = false
  shirt_sizes: Array<string>= [
    'Youth Extra Small',
    'Youth Small',
    'Youth Medium',
    'Youth Large',
    'Youth Extra Large',
    'Adult Small',
    'Adult Medium',
    'Adult Large',
    'Adult Extra Large',
    'Adult Double Extra Large',
  ];
  youth_schools: Array<{text: string, value:string}>= [];
  teen_schools: Array<{text: string, value:string}>= [];
  first_name: string = '';
  middle_name: string = '';
  last_name: string = '';
  phone_number: string = '';
  email: string = '';
  home_library: string = '';
  shirt_size: string = '';
  club: string = '';
  school_type: string = '';
  school: string = '';
  send_to_school: boolean = true;
  valid: boolean = true;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    public modalController: ModalController,
    private _location: Location,
    private platform: Platform,
    private http: HttpClient,
    public user: User,
  ) { }

  async view_details(reader) {
    this.subscription.unsubscribe();
    const modal = await this.modalController.create({
      component: SummerDetailPage,
      componentProps: {
        "reader": reader,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        console.log('Modal sent data: ', dataReturned);
        this.subscription = this.platform.backButton.subscribe(() => {
          this._location.back();
        });
      }
    });
    return await modal.present();
  }

  load_participants() {
    let params = new HttpParams()
      .set("token", this.user.token)
      .set("v", "5");
    let url = this.globals.summer_reading_check_participants;
    this.globals.loading_show();
    this.http.get(url, {params: params})
      .subscribe(data => {
        this.participants = data['participants']
        this.youth_schools = data['youth_schools']
        this.teen_schools = data['teen_schools']
        this.youth_schools.shift()
        this.teen_schools.shift()
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
    this.globals.api_loading = false;
  }

  display_register(show) {
    if(show == 'true'){
      this.show_register = true
    }else{
      this.show_register = false
    }
  }

  detect_changed_club(){
    this.school_type = ''
  }


  check_valid(term){
    switch (term) {
      case "":
      case null:
      case " ":
        return false;
      default:
        return true;
      }
  }


  register_participant(){
    let params = new HttpParams().set("v", "5")
    this.valid = true
    if(this.check_valid(this.last_name)){
      document.getElementsByClassName('last_name_required')[0].setAttribute('style', 'color: black');
      params = params.set("last_name", this.last_name)
    }else{
      document.getElementsByClassName('last_name_required')[0].setAttribute('style', 'color: red');
      this.valid = false
    }
    if(this.check_valid(this.first_name)){
      document.getElementsByClassName('first_name_required')[0].setAttribute('style', 'color: black');
      params = params.set("first_name", this.first_name)
    }else{
      document.getElementsByClassName('first_name_required')[0].setAttribute('style', 'color: red');
      this.valid = false
    }
    if(this.check_valid(this.phone_number)){
      document.getElementsByClassName('phone_number_required')[0].setAttribute('style', 'color: black');
      params = params.set("phone_number", this.phone_number)
    }else{
      document.getElementsByClassName('phone_number_required')[0].setAttribute('style', 'color: red');
      this.valid = false
    }
    if(this.check_valid(this.home_library)){
      document.getElementsByClassName('home_library_required')[0].setAttribute('style', 'color: black');
      params = params.set("home_library", this.home_library)
    }else{
      document.getElementsByClassName('home_library_required')[0].setAttribute('style', 'color: red');
      this.valid = false
    }
    if(this.check_valid(this.shirt_size)){
      document.getElementsByClassName('shirt_size_required')[0].setAttribute('style', 'color: black');
      params = params.set("shirt_size", this.shirt_size)
    }else{
      document.getElementsByClassName('shirt_size_required')[0].setAttribute('style', 'color: red');
      this.valid = false
    }
    if(this.check_valid(this.club)){
      document.getElementsByClassName('club_required')[0].setAttribute('style', 'color: black');
      params = params.set("club", this.club)
    }else{
      document.getElementsByClassName('club_required')[0].setAttribute('style', 'color: red');
      this.valid = false
    }
    if(this.club == 'teens' || this.club == 'readers'){
      if(this.check_valid(this.school_type)){
        document.getElementsByClassName('school_type_required')[0].setAttribute('style', 'color: black');
        if(this.check_valid(this.school)){
          if(this.club == 'readers'){
            document.getElementsByClassName('youth_school_required')[0].setAttribute('style', 'color: black');
          }else{
            document.getElementsByClassName('teen_school_required')[0].setAttribute('style', 'color: black');
          }
          params = params.set("school", this.school)
        }else{
          if(this.club == 'readers'){
            document.getElementsByClassName('youth_school_required')[0].setAttribute('style', 'color: red');
          }else{
            document.getElementsByClassName('teen_school_required')[0].setAttribute('style', 'color: red');
          }
          this.valid = false
        }
      }else{
        document.getElementsByClassName('school_type_required')[0].setAttribute('style', 'color: red');
        this.valid = false
      }
      params = params.set("send_to_school", String(this.send_to_school))
    }
    params = params.set("library_card", String(this.user.card))
    if(this.valid == true ){
      let url = this.globals.summer_reading_save_participant;
      this.globals.loading_show();
      this.http.get(url, {params: params})
        .subscribe(data => {
          if(data['message'] == 'success'){
            this.toast.present("Participant was successfully registered for Summer Reading Club!", 5000);
            this.load_participants()
            this.reset_values()
            this.show_register = false 
          }else{
            this.toast.present("Something went wrong please try again later.", 5000);
          }
        },
        (err) => {
          this.toast.present(this.globals.server_error_msg);
        });
      this.globals.api_loading = false;
    }else{
      this.toast.present("Missing required fields.", 5000);
    }
  }



  ngOnInit() {
    if (this.user.token) {
      this.load_participants();
    }
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      this._location.back();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}