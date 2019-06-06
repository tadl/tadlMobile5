import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast/toast.service';
import { User } from '../user';

@Component({
  selector: 'app-summer-detail',
  templateUrl: './summer-detail.page.html',
  styleUrls: ['./summer-detail.page.scss'],
})

export class SummerDetailPage implements OnInit {

  id: string = '';
  participant: any;
  total_minutes: string = '';
  reports: any;
  items: any;
  weeks: any;
  months: Array<string> = ["January", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

  constructor(
    public globals: Globals,
    public toast: ToastService,
    private http: HttpClient,
    public user: User,
  ) { }

  fetch_report_info(id){
    let params = new HttpParams().set("v", "5")
    params = params.set("participant_id", id)
    params = params.set("token", this.user.token)
    let url = this.globals.summer_reading_load_report_interface;
    this.http.get(url, {params: params})
        .subscribe(data => {
          if(data['participant']){
            this.participant = data['participant']
            this.total_minutes = data['total_minutes']
            this.reports = data['reports']
            this.weeks = data['weeks']
            this.items = data['items']
          }else{
            this.toast.present("Something went wrong please try again later.", 5000);
          }
        },
        (err) => {
          this.toast.present(this.globals.server_error_msg);
        });
  }

  date_to_month(data_string){
    let raw_date = new Date(data_string)
    let month = raw_date.getMonth()
    let day = raw_date.getDate()
    return this.months[month] + " " + day
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
    let monday = (<HTMLInputElement>document.getElementById('monday_' + week_id)).value;
    let tuesday = (<HTMLInputElement>document.getElementById('tuesday_' + week_id)).value;
    let wednesday = (<HTMLInputElement>document.getElementById('wednesday_' + week_id)).value;
    let thursday = (<HTMLInputElement>document.getElementById('thursday_' + week_id)).value;
    let friday = (<HTMLInputElement>document.getElementById('friday_' + week_id)).value;
    let saturday = (<HTMLInputElement>document.getElementById('saturday_' + week_id)).value;
    let sunday = (<HTMLInputElement>document.getElementById('sunday_' + week_id)).value;
    let items = (<HTMLInputElement>document.getElementById('items_' + week_id)).value;
    //next up set params, post, and refresh
  }

  ngOnInit() {
    this.fetch_report_info(this.id)
  }

}
