import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelOrderReasonPageRoutingModule } from './cancel-order-reason-routing.module';

import { CancelOrderReasonPage } from './cancel-order-reason.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelOrderReasonPageRoutingModule
  ],
  declarations: [CancelOrderReasonPage]
})
export class CancelOrderReasonPageModule {}
