import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'authentication',
    loadChildren: () => import('./auth/authentication/authentication.module').then( m => m.AuthenticationPageModule)
  },
  {
    path: 'otp-verification',
    loadChildren: () => import('./auth/otp-verification/otp-verification.module').then( m => m.OtpVerificationPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'current-order',
    loadChildren: () => import('./orders/current-order/current-order.module').then( m => m.CurrentOrderPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'cancel-order-reason/:restaurantOrderId',
    loadChildren: () => import('./cancel-order-reason/cancel-order-reason.module').then( m => m.CancelOrderReasonPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
