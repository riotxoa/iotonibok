import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
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

  constructor(public navCtrl: NavController, public authService:AuthServiceProvider, public alertCtrl: AlertController) {

      var uData = JSON.parse(localStorage.getItem('userData'));

      if(uData) {
          this.userData.username = uData.username;
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
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
         console.log("[login] error: " + err);
         this.userData.username = "";
         this.userData.password = "";
         this.loginfail();
     });
  }

  loginfail() {
      let alert = this.alertCtrl.create({
          title: 'Autenticación fallida',
          subTitle: 'Introduzca un nombre de usuario y contraseña correctos',
          buttons: ['Aceptar']
      });
      alert.present();
  }

}
