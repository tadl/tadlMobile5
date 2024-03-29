import { Injectable } from '@angular/core';
import { Platform, ModalController, MenuController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Injectable()

export class Globals {

  constructor(
    private menuController: MenuController,
    private modalController: ModalController,
    private platform: Platform,
  ) { }

  /* CUSTOMIZABLE VARIABLES */

  /* app version */
  public app_version: string = '5.1.0';
  public update_version: string = '2022021600';

  /* basic information */
  public catalog_host: string = 'apiv4.catalog.tadl.org'; /* hostname for catalog api */
  public catalog_covers_host: string = 'catalog.tadl.org'; /* hostname for catalog extras */
  public website_host: string = 'www.tadl.org'; /* hostname for website */
  public system_short_name: string = 'TADL';
  public all_locations_value: string = '22';
  public news_category_exclude: string = '93'; /* 93=Announcement */

  /* feature toggles */
  public multi_location: boolean = true;
  public use_melcat: boolean = true;
  public has_audiences: boolean = true;

  /* customizable strings */
  public server_error_msg: string = "Whoops. Something went wrong. Please check your internet connection and try again in a minute.";
  public reset_card_label: string = "Username or Card #";

  /* static assets */
  public logo_url: string = '/assets/logo.png';
  public square_logo_url: string = '/assets/logo-clock-only.png';

  /* *** Do not edit below here *** */

  /* catalog things */
  public catalog_schema: string = 'https://';
  public catalog_api_base: string = this.catalog_schema + this.catalog_host;
  public catalog_covers_base: string = this.catalog_schema + this.catalog_covers_host + '/opac/extras/ac/jacket';

  public catalog_login_url: string = this.catalog_api_base + '/login.json';
  public catalog_logout_url: string = this.catalog_api_base + '/logout.json';
  public catalog_place_hold_url: string = this.catalog_api_base + '/place_hold.json';
  public catalog_holds_url: string = this.catalog_api_base + '/holds.json';
  public catalog_holds_pickup_url: string = this.catalog_api_base + '/holds_pickup.json';
  public catalog_checkouts_url: string = this.catalog_api_base + '/checkouts.json';
  public catalog_checkout_history_url: string = this.catalog_api_base + '/checkout_history.json';
  public catalog_search_url: string = this.catalog_api_base + '/search.json';
  public catalog_renew_url: string = this.catalog_api_base + '/renew_checkouts.json';
  public catalog_holds_manage_url: string = this.catalog_api_base + '/manage_hold.json';
  public catalog_change_hold_pickup_url: string = this.catalog_api_base + '/change_hold_pickup.json';
  public catalog_fines_url: string = this.catalog_api_base + '/fines.json';
  public catalog_featured_url: string = this.catalog_api_base + '/index.json';
  public catalog_preferences_url: string = this.catalog_api_base + '/preferences.json';
  public catalog_update_preferences_url: string = this.catalog_api_base + '/update_preferences.json';
  public catalog_password_reset_url: string = this.catalog_api_base + '/submit_password_reset.json';
  public catalog_square_covers_url: string = this.catalog_api_base + '/';

  public catalog_covers_small: string = this.catalog_covers_base + '/small/r/';
  public catalog_covers_medium: string = this.catalog_covers_base + '/medium/r/';
  public catalog_covers_large: string = this.catalog_covers_base + '/large/r/';

  /* website things */
  public website_schema: string = 'https://';

  public events_api_url: string = this.website_schema + 'events.tadl.org/events/feed/json';

  public news_api_url: string = this.website_schema + this.website_host + '/wp-json/wp/v2/posts';
  public hours_locations_url: string = 'https://www.tadl.org/locations.json';
  public pay_fines_url: string = this.website_schema + this.website_host + '/pay/pay.cgi'; /* redirected by nginx */


  /* summer reading */
  public summer_reading_base: string = 'https://summer.tadl.org';
  public summer_reading_check_participants: string = this.summer_reading_base + '/patron_show_participants.json';
  public summer_reading_save_participant: string = this.summer_reading_base + '/save_new_participant.json';
  public summer_reading_load_report_interface = this.summer_reading_base + '/patron_load_report_interface.json';
  public summer_reading_update_week = this.summer_reading_base + '/record_minutes.json'
  public youth_schools: Array<{text: string, value:string}> = [];
  public teen_schools: Array<{text: string, value:string}> = [];

  /* global vars */
  public api_loading: boolean = false;
  public net_status: string = "online";
  public net_type: string = "undefined";

  /* Arrays and Maps to handle multi-location things */
  /* Used for changing pickup locations on holds */
  public pickup_locations: Array<{name: string, code: string}> = [
    { name: 'Traverse City', code: '23' },
    { name: 'Interlochen', code: '24' },
    { name: 'Kingsley', code: '25' },
    { name: 'Peninsula', code: '26' },
    { name: 'Fife Lake', code: '27' },
    { name: 'East Bay', code: '28' },
  ];

  /* Used for searching */
  public search_locations: Array<{name: string, code: string}> = [
    { name: 'All Locations', code: '22' },
    { name: 'Traverse City', code: '23' },
    { name: 'Interlochen', code: '24' },
    { name: 'Kingsley', code: '25' },
    { name: 'Peninsula', code: '26' },
    { name: 'Fife Lake', code: '27' },
    { name: 'East Bay', code: '28' },
  ];

  /* Used for displaying location name on item details */
  public short_to_friendly_name = new Map<string, string>([
    ['TADL-EBB', 'East Bay'],
    ['TADL-KBL', 'Kingsley'],
    ['TADL-PCL', 'Peninsula'],
    ['TADL-IPL', 'Interlochen'],
    ['TADL-FLPL', 'Fife Lake'],
    ['TADL-WOOD', 'Traverse City'],
  ]);

  /* Used for filtering events by location */
  public event_venues: Array<{venue: number, name: string}> = [
    { venue: 89, name: 'Traverse City' },
    { venue: 132, name: 'East Bay' },
    { venue: 133, name: 'Fife Lake' },
    { venue: 134, name: 'Kingsley' },
    { venue: 135, name: 'Interlochen' },
    { venue: 136, name: 'Peninsula' },
    { venue: 160, name: 'Online' },
  ];

/*
    { venue: 97, name: 'Traverse City' },
    { venue: 98, name: 'East Bay' },
    { venue: 99, name: 'Fife Lake' },
    { venue: 100, name: 'Interlochen' },
    { venue: 101, name: 'Kingsley' },
    { venue: 102, name: 'Peninsula' },
  ]; */

  /* Formats */
  public formats: string[] = [
    'All Formats',
    'Books',
    'Books - Fiction',
    'Books - Non-fiction',
    'Large Print',
    'Large Print - Fiction',
    'Large Print - Non-fiction',
    'Audiobooks',
    'Audiobooks - Fiction',
    'Audiobooks - Non-fiction',
    'eBooks',
    'eBooks - Fiction',
    'eBooks - Non-fiction',
    'Movies / TV',
    'Music',
    'Video Games',
  ]

  /* Format type icons */
  item_type = new Map<string, string>([
    ['text', 'book'],
    ['notated music', 'musical-notes'],
    ['cartographic', 'map'],
    ['moving image', 'film'],
    ['sound recording-nonmusical', 'disc'],
    ['sound recording-musical', 'disc'],
    ['still image', 'image'],
    ['software, multimedia', 'document'],
    ['kit', 'briefcase'],
    ['mixed-material', 'briefcase'],
    ['three dimensional object', 'archive'],
  ]);

  /* Sort Options */
  public sort_options: Array<string[]> = [
    ['Relevance', 'relevance'],
    ['Newest to Oldest', 'pubdateDESC'],
    ['Oldest to Newest', 'pubdateASC'],
    ['Title A to Z', 'titleAZ'],
    ['Title Z to A', 'titleZA'],
  ]

  /* Audiences */
  public audiences: Array<string> = [ "All", "Adult", "Young Adult", "Juvenile" ];

  /* FUNctions */

  /* date formatter */
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

  /* returns today's day, for displaying hours today */
  day_today() {
    return format(new Date(), 'EEEE');
  }

  /* used to display images on news detail pages */
  original_image_from_thumbnail(url) {
    return url.replace(/-150x150/, '');
  }

  /* toggles for added content on item detail */
  show_more(id, type) {
    var div_to_hide = id + '-' + type;
    var div_to_show = div_to_hide + '-full';
    document.getElementById(div_to_show).setAttribute('style', 'display: block');
    document.getElementById(div_to_hide).setAttribute('style', 'display: none');
  }
  show_less(id, type) {
    var div_to_show = id + '-' + type
    var div_to_hide = div_to_show + '-full'
    document.getElementById(div_to_show).setAttribute("style", "display: block")
    document.getElementById(div_to_hide).setAttribute("style", "display: none")
  }

  /* opens account menu */
  open_account_menu() {
    this.menuController.open('right');
  }

  /* closes modals */
  async close_modal() {
    const onClosedData: string = "Wrapped up!";
    await this.modalController.dismiss(onClosedData);
  }

  /* image error */
  image_error(event) {
    event.target.src = this.square_logo_url;
  }

  /* api loading indicator */
  loading_show() {
    this.api_loading = true;
  }

}
