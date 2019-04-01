import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Globals } from './globals';
import { LoadingService } from './services/loading/loading.service';
import { ToastService } from './services/toast/toast.service';

@Component({
})

export class Item {

  featured: any;
  featured_keys: any = [];
  media_type: any;

  constructor(
    public globals: Globals,
    public loading: LoadingService,
    public toast: ToastService,
    private http: HttpClient,
  ) { }

  get_featured() {
    let params = new HttpParams()
      .set("compact", "true");
    let url = this.globals.catalog_featured_url;
    this.http.get(url, {params: params})
      .subscribe(data => {
        if (data['featured_items']) {
          this.featured = data['featured_items'];
          this.featured_keys = Object.keys(data['featured_items']);
          this.media_type = this.featured_keys[0];
        }
      },
      (err) => {
        this.toast.present(this.globals.server_error_msg);
      });
  }

}
