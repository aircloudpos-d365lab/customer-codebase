import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDataService } from './services/user-data.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Observable } from 'rxjs';
import { RestDataService } from './services/rest-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: NavController,
    private data: UserDataService,
    private firebase: FirebaseX,
    private rest: RestDataService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();

      this.firebase.onTokenRefresh().subscribe(token => {
        localStorage.setItem('pushToken', token);
        console.log('token got');
        console.log(token);
        if (this.data.getTenantId()) {
          this.rest.updateToken(token);
        }
      });

      this.firebase.onMessageReceived().subscribe(res => {
        if (res.tap === 'background') {
          this.router.navigateForward('/home');
        }
      });
    });
  }
}
