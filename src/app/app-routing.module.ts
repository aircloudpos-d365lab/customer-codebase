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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
