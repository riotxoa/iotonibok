import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

/**
 * Generated class for the OfferDiscountModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offer-discount-modal',
  templateUrl: 'offer-discount-modal.html',
})
export class OfferDiscountModalPage {

    offer;
    cssClass;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public restService: RestServiceProvider) {
        this.offer = navParams.data.offer;
        this.cssClass = (this.offer.valoracion ? "accepted" : "rejected");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OfferDiscountModalPage');
    }

    updateAmount(ev) {
        var val = (ev.target.value ? parseInt(ev.target.value) : 1);
        if( val > 0 ) {
            this.offer.amount = val;
        }
    }

    updateDiscount(ev) {
        var val = (ev.target.value ? parseInt(ev.target.value) : 0);
        if( val > -1 ) {
            this.offer.discount = val;
        }
    }

    updateGift(ev) {
        var val = (ev.target.value ? parseInt(ev.target.value) : 0);
        if( val > -1 ) {
            this.offer.gift = val;
        }
    }

    resetDiscount() {
        this.offer.amount = 1;
        this.offer.discount = 0;
        this.offer.gift = 0;
    }

    acceptSettings() {
        this.viewCtrl.dismiss(this.offer);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
