import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpBackend, HttpXhrBackend, HttpClientModule } from '@angular/common/http';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
import { FormsModule } from '@angular/forms';
import { NgxBarcodeModule } from 'ngx-barcode';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { Platform, IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
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
import { LocationDetailPageModule } from './location-detail/location-detail.module';
import { CardPageModule } from './card/card.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__db',
      driverOrder: ['indexeddb', 'websql'],
    }),
    NativeHttpModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    EventDetailPageModule,
    NewsDetailPageModule,
    ItemDetailPageModule,
    LocationDetailPageModule,
    CardPageModule,
    NgxBarcodeModule,
    TruncateModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  providers: [
    Globals,
    User,
    Item,
    StatusBar,
    SplashScreen,
    Device,
    Keyboard,
    InAppBrowser,
    LoadingService,
    ToastService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend] },
  ],
})
export class AppModule { }
