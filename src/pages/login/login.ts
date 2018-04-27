import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Clipboard } from '@ionic-native/clipboard';
import { Keyboard } from '@ionic-native/keyboard';

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
  @ViewChild('username') userInput;
  @ViewChild('password') passInput;

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
      private keyboard: Keyboard,
      public loadingCtrl: LoadingController,
  ) {
      var uData = JSON.parse(localStorage.getItem('userData'));
      if(uData) {
          this.userData.username = uData.username;
      }

      this.uuid.value = JSON.parse(localStorage.getItem('uuid'));
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    let loading = this.loadingCtrl.create({
        content: 'Comprobando dispositivo...'
    });
    loading.onDidDismiss( () => {
        if(this.userData.username.length > 0)
            setTimeout(() => {
                this.passInput.setFocus();
            },150);
        else
            setTimeout(() => {
                this.userInput.setFocus();
            },150);
    });
    loading.present();

    this.authService.postData(this.uuid, 'api/login').then(
        (result) => {
            this.deviceChecked = (result ? true : false);
            loading.dismiss();
        },
        (error) => {
            console.log("[ionViewDidLoad - login.ts] error: " + error);
            loading.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Se ha producido un error al comprobar el dispositivo: ' + error,
                buttons: ['Aceptar'],
            });
            alert.present();
        }
    );
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
          buttons: [{
              text: 'Aceptar',
              role: 'cancel',
              handler: () => {
                  setTimeout(() => {
                      this.userInput.setFocus();
                  },500);
              }
          },],
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
