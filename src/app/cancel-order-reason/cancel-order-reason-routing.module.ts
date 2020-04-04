import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelOrderReasonPage } from './cancel-order-reason.page';

const routes: Routes = [
  {
    path: '',
    component: CancelOrderReasonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelOrderReasonPageRoutingModule {}
