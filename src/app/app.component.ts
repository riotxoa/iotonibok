import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any; // = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, uniqueDeviceID: UniqueDeviceID, alertCtrl: AlertController) {
    platform.ready().then(() => {

      uniqueDeviceID.get()
        .then((a: any) => {
            localStorage.setItem('uuid', JSON.stringify(a));
            this.rootPage = LoginPage;
        })
        .catch((error: any) => {
            localStorage.setItem('uuid', JSON.stringify("YYY"));
            this.rootPage = LoginPage;
        });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  getDeviceID() {
      return {uuid: "KKK"};
  }
}
