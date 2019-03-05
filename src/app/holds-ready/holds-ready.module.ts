import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HoldsReadyPage } from './holds-ready.page';

const routes: Routes = [
  {
    path: '',
    component: HoldsReadyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HoldsReadyPage]
})
export class HoldsReadyPageModule {}
