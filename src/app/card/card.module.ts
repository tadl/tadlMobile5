import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxBarcodeModule } from 'ngx-barcode';

import { CardPage } from './card.page';

const routes: Routes = [
  {
    path: '',
    component: CardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxBarcodeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CardPage]
})
export class CardPageModule {}
