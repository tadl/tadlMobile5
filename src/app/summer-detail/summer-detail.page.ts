import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast/toast.service';
import { User } from '../user';
import { format, isBefore, isAfter, parseISO } from 'date-fns';

@Component({
  selector: 'app-summer-detail',
  templateUrl: './summer-detail.page.html',
  styleUrls: ['./summer-detail.page.scss'],
})

export class SummerDetailPage implements OnInit {

  id: string = '';
  participant: any;
  reports: any;
  items: any;
  weeks: any;

  constructor(
    public globals: Globals,
    public toast: ToastService,
    private http: HttpClient,
    public user: User,
  ) { }

  fetch_report_info(id) {
    this.globals.loading_show();
    let params = new HttpParams().set("v", "5")
      .set("participant_id", id)
      .set("token", this.user.token);
    let url = this.globals.summer_reading_load_report_interface;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if(data['participant']){
          this.participant = data['participant']
          this.reports = data['reports']
          this.weeks = data['weeks'].reverse();
          this.items = data['items']
        }else{
          this.toast.present("Something went wrong please try again later.", 5000);
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
    this.globals.api_loading = false;
  }

  has_week_started(date){
    let start_date = new Date(date)
    let date_now = new Date('2019-7-10')
    // let date_now = new Date()
    if(date_now > start_date){
      return true
    }else{
      return false
    }
  }

  date_format(date_string) {
    return format(parseISO(date_string), 'LLL d');
  }

  get_day_total(day, week_id){
    let target_report = this.reports.find( report =>{
      return report.week_id == week_id
    })
    if(target_report != undefined){
      return target_report[day]
    }
  }

  get_week_items(week_id){
    let target_item = this.items.find( item =>{
      return item.week_id == week_id
    })
    if(target_item != undefined){
      return target_item.name
    }
  }

  update_week(week_id){
    let params = new HttpParams().set("v", "5")
    params = params.set("week_id", week_id)
    params = params.set("participant_id", this.id)
    params = params.set("token", this.user.token)
    params = params.set("from_patron", 'true')
    let monday = (<HTMLInputElement>document.getElementById('monday_' + week_id)).value;
    params = params.set("monday", monday)
    let tuesday = (<HTMLInputElement>document.getElementById('tuesday_' + week_id)).value;
    params = params.set("tuesday", tuesday)
    let wednesday = (<HTMLInputElement>document.getElementById('wednesday_' + week_id)).value;
    params = params.set("wednesday", wednesday)
    let thursday = (<HTMLInputElement>document.getElementById('thursday_' + week_id)).value;
    params = params.set("thursday", thursday)
    let friday = (<HTMLInputElement>document.getElementById('friday_' + week_id)).value;
    params = params.set("friday", friday)
    let saturday = (<HTMLInputElement>document.getElementById('saturday_' + week_id)).value;
    params = params.set("saturday", saturday)
    let sunday = (<HTMLInputElement>document.getElementById('sunday_' + week_id)).value;
    params = params.set("sunday", sunday)
    let items = (<HTMLInputElement>document.getElementById('items_' + week_id)).value;
    params = params.set("item", items)
    let url = this.globals.summer_reading_update_week;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if(data && data['success'] == true){
          this.fetch_report_info(this.id)
          this.toast.present("You have successfully updated your summer reading activity.", 2000);
          this.user.load_participants()
        }else{
          this.toast.present("Something went wrong please try again later.", 5000);
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

  ngOnInit() {
    this.fetch_report_info(this.id)
  }

}
