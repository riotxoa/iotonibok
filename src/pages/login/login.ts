import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Clipboard } from '@ionic-native/clipboard';

import { MainPage } from '../main/main';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  responseData: any;
  uuid = {
      value: "XXX"
  };
  deviceChecked = false;
  userData = {
      "username": "",
      "password": "",
    //   "client_id": "3",
    //   "client_secret": "Aeh9f02sUqukoiNJDtIQIAl2ryn02bOiTy5bXfTg",
      "client_id": "2",
      "client_secret": "WUfwaLPljoVHqL6pHgY8ZOSKtSER9hbQUrrZiJuY",
      "grant_type": "password",
      "scope": "*"
  };

  constructor(
      public navCtrl: NavController,
      public authService:AuthServiceProvider,
      public alertCtrl: AlertController,
      public navPar: NavParams,
      private clipboard: Clipboard,
      public toastCtrl: ToastController,
  ) {
      var uData = JSON.parse(localStorage.getItem('userData'));
      if(uData) {
          this.userData.username = uData.username;
      }

      this.uuid.value = JSON.parse(localStorage.getItem('uuid'));
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.authService.postData(this.uuid, 'api/login').then((result) => {
        this.deviceChecked = (result ? true : false);
    });
  }

  login() {
      this.authService.postData(this.userData,'oauth/token').then((result) => {
           this.responseData = result;
           if(this.responseData.access_token) {
               this.responseData.username = this.userData.username;
               this.responseData.email = this.userData.username;

               localStorage.setItem('userData', JSON.stringify(this.responseData));

               this.userData.password = "";

               this.navCtrl.push(MainPage);
           } else {
               console.log("Not valid user credentials");
           }
     }, (err) => {
         this.loginfail(err);
     });
  }

  loginfail(msg) {
      console.log("[login] error: " + msg);

      this.userData.username = "";
      this.userData.password = "";

      let alert = this.alertCtrl.create({
          title: 'Autenticación fallida',
          subTitle: 'Introduzca un nombre de usuario y contraseña correctos',
          buttons: ['Aceptar']
      });
      alert.present();
  }

  copy() {
      this.clipboard.copy(this.uuid.value);
      let toast = this.toastCtrl.create({
          message: 'Código copiado al portapapeles',
          duration: 1500,
          cssClass: 'toast'
      });
      toast.present();
  }

}
