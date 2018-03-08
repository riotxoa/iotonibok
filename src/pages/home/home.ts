import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userDetails : any;
  responseData: any;

  userPostData = {"username":"", "email": "", "token":""};

  constructor(public navCtrl: NavController, public app: App, public authService:AuthServiceProvider) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data;

    this.userPostData.username = this.userDetails.username;
    this.userPostData.email = this.userDetails.email;
    this.userPostData.token = this.userDetails.token;
  }

  logout(){
    // Remove API token
    this.userPostData.username = "";
    this.userPostData.email = "";
    this.userPostData.token = "";

    const root = this.app.getRootNav();
    root.popToRoot();
  }

}
