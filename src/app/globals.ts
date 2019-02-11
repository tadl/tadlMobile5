import { Injectable } from '@angular/core';

@Injectable()

export class Globals {
  constructor() {
  }

  public system_short_name: string = 'TADL';
  public catalog_host: string = 'catalog.tadl.org';
  public catalog_api_host: string = 'apiv4.catalog.tadl.org';
  public website_host: string = 'www.tadl.org';
  public logo_file_name: string = 'logo.png'; /* redirected by nginx */
  public square_logo_file_name: string = 'logo-clock-only.png'; /* redirected by nginx */
  public news_category_exclude: string = '93'; /* 93=Announcement */

  public multi_location: boolean = true;
  public all_locations_value: string = '22';

}
