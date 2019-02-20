import { Injectable } from '@angular/core';

@Injectable()

export class Globals {
  constructor() { }

  public system_short_name: string = 'TADL';
  public catalog_host: string = 'catalog.tadl.org';
  public catalog_api_host: string = 'https://catalog-preview.appstwo.tadl.org/';
  public website_host: string = 'www.tadl.org';
  public logo_file_name: string = 'logo.png'; /* redirected by nginx */
  public square_logo_file_name: string = 'logo-clock-only.png'; /* redirected by nginx */
  public news_category_exclude: string = '93'; /* 93=Announcement */
  public server_error_msg: string = "Whoops. Something went wrong. Please check your internet connection and try again in a minute";
  public multi_location: boolean = true;
  public all_locations_value: string = '22';
  public greetings: Array<any> = ['Hello', 'Hola', 'Bonjour', 'Hej', 'Guten tag', 'Ciao', 'Ahoj', 'Sveiki', 'Bok', 'Salut', 'Komentari', 'Tere'];
  public pickup_locations: Array<{name: string, code: string}> = [
    { name: 'Woodmere', code: '23' },
    { name: 'Interlochen', code: '24' },
    { name: 'Kingsley', code: '25' },
    { name: 'Peninsula', code: '26' },
    { name: 'Fife Lake', code: '27' },
    { name: 'East Bay', code: '28' }
  ];


}
