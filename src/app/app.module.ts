import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgxBarcodeModule } from 'ngx-barcode';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globals } from './globals';
import { User } from './user';
import { Item } from './item';

import { LoadingService } from './services/loading/loading.service';
import { ToastService } from './services/toast/toast.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EventDetailPageModule } from './event-detail/event-detail.module';
import { NewsDetailPageModule } from './news-detail/news-detail.module';
import { ItemDetailPageModule } from './item-detail/item-detail.module';
import { CardPageModule } from './card/card.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    EventDetailPageModule,
    NewsDetailPageModule,
    ItemDetailPageModule,
    CardPageModule,
    NgxBarcodeModule,
    TruncateModule,
  ],
  providers: [
    Globals,
    User,
    Item,
    StatusBar,
    SplashScreen,
    LoadingService,
    ToastService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
