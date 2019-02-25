import { Injectable } from '@angular/core';
import { format, formatDistance, formatRelative, subDays, parseISO } from 'date-fns';

@Injectable()

export class Globals {
  constructor() { }

  /* customizable variables */
  public catalog_host: string = 'catalog-preview.appstwo.tadl.org';
  public website_host: string = 'www.tadl.org';

  public system_short_name: string = 'TADL';
  public multi_location: boolean = true;
  public all_locations_value: string = '22';

  public news_category_exclude: string = '93'; /* 93=Announcement */

  public server_error_msg: string = "Whoops. Something went wrong. Please check your internet connection and try again in a minute";
  public greetings: Array<any> = ['Hello', 'Hi', 'Greetings', 'Hiya', 'Yo', 'Howdy'];

  /* catalog things */
  public catalog_api_host: string = 'https://' + this.catalog_host + '/';

  /* website things */
  public events_api_url: string = 'https://' + this.website_host + '/wp-json/tribe/events/v1/events';
  public news_api_url: string = 'https://' + this.website_host + '/wp-json/wp/v2/posts';
  public hours_locations_url: string = 'https://' + this.website_host + '/wp-content/uploads/json/parsed-hours.json';
  public logo_url: string = 'https://' + this.website_host + '/logo.png'; /* redirected by nginx */
  public square_logo_url: string = 'https://' + this.website_host + '/logo-clock-only.png'; /* redirected by nginx */

  public pickup_locations: Array<{name: string, code: string}> = [
    { name: 'Woodmere', code: '23' },
    { name: 'Interlochen', code: '24' },
    { name: 'Kingsley', code: '25' },
    { name: 'Peninsula', code: '26' },
    { name: 'Fife Lake', code: '27' },
    { name: 'East Bay', code: '28' }
  ];

  format_date(str, fmt?) {
    if (fmt == "event") {
      return format(parseISO(str), 'EEE LLLL do, h:mm a');
    } else if (fmt == "eventdetailday") {
      return format(parseISO(str), 'EEEE');
    } else if (fmt == "eventdetaildate") {
      return format(parseISO(str), 'LLLL do');
    } else if (fmt == "eventdetailtime") {
      return format(parseISO(str), 'h:mm a');
    } else if (fmt == "news") {
      return format(parseISO(str), 'LLLL do, h:mm a');
    }

  }
}
