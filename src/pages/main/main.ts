import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OfferPage } from '../offer/offer';
import { KitsPage } from '../kits/kits';
import { ProductsPage } from '../products/products';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

    tabOffer = OfferPage;
    tabKits = KitsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  productos() {
      this.navCtrl.push(ProductsPage);
  }

  logout() {
      localStorage.removeItem('userData');
      sessionStorage.clear();
      this.navCtrl.popToRoot();
  }

}
