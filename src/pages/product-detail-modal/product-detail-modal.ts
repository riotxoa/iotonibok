import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

/**
 * Generated class for the ProductDetailModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-detail-modal',
  templateUrl: 'product-detail-modal.html',
})
export class ProductDetailModalPage {

    product;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public restService: RestServiceProvider) {
        this.product = navParams.data.product;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProductDetailModalPage');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
