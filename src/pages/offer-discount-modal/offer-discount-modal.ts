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
        var val = ev.target.value;
        if( val > 0 ) {
            this.offer.amount = val;
            // this.updateRow();
        }
    }

    updateDiscount(ev) {
        var val = ev.target.value;
        if( val > -1 ) {
            this.offer.discount = val;
            // this.updateRow();
        }
    }

    updateGift(ev) {
        var val = ev.target.value;
        if( val > -1 ) {
            this.offer.gift = val;
            // this.updateRow();
        }
    }

    // updateRow() {
    //     var rowDiscount = (this.row.discount ? this.row.discount : this.globalDiscount);
    //
    //     // var row_cost = this.row.product.cost * (parseInt(this.row.amount) + parseInt(this.row.gift));
    //     // var row_margin = (this.row.price_o - row_cost)*100 / this.row.price_o;
    //
    //     this.row.product.price = (this.row.product.price_unit * this.row.amount).toFixed(2);
    //     this.row.price_o = this.getPriceWithDiscount(this.row.product.price, rowDiscount);
    //     // this.row.valoracion = (row_margin >= this.row.product.margin ? 1 : 0);
    //
    //     this.cssClass = "unknown";
    // }
    //
    // getValoracion() {
    //     this.restService.getRowValoracion(this.row).then( data => {
    //         this.row.valoracion = data;
    //         this.cssClass = (this.row.valoracion ? "accepted" : "rejected");
    //     });
    // }

    acceptRow() {
        this.viewCtrl.dismiss(this.offer);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
