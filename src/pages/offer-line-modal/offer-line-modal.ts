import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

/**
 * Generated class for the OfferLineModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offer-line-modal',
  templateUrl: 'offer-line-modal.html',
})
export class OfferLineModalPage {

    row;
    rowDiscount;
    globalDiscount;
    getPriceWithDiscount;
    getRowValoracion;
    cssClass;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public restService: RestServiceProvider) {
        this.row = navParams.data.row;
        this.globalDiscount = navParams.data.discount;
        this.rowDiscount = (this.row.discount ? this.row.discount : this.globalDiscount);
        this.getPriceWithDiscount = navParams.data.calcPrice;
        this.cssClass = (this.row.authorized ? "accepted" : "rejected");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OfferLineModalPage');
    }

    updateAmount(ev) {
        var val = ev.target.value;
        if( val > 0 ) {
            this.row.amount = val;
            this.updateRow();
        }
    }

    updateDiscount(ev) {
        var val = ev.target.value;
        if( val > -1 ) {
            this.row.discount = val;
            this.updateRow();
        }
    }

    updateGift(ev) {
        var val = ev.target.value;
        if( val > -1 ) {
            this.row.gift = val;
            this.updateRow();
        }
    }

    updateRow() {
        var rowDiscount = (this.row.discount ? this.row.discount : this.globalDiscount);

        // var row_cost = this.row.product.cost * (parseInt(this.row.amount) + parseInt(this.row.gift));
        // var row_margin = (this.row.price_o - row_cost)*100 / this.row.price_o;

        this.row.product.price = (this.row.product.price_unit * this.row.amount).toFixed(2);
        this.row.price_o = this.getPriceWithDiscount(this.row.product.price, rowDiscount);
        // this.row.authorized = (row_margin >= this.row.product.margin ? 1 : 0);

        this.cssClass = "unknown";
    }

    getValoracion() {
        this.restService.getRowValoracion(this.row).then( data => {
            this.row.authorized = data;
            this.cssClass = (this.row.authorized ? "accepted" : "rejected");
        });
    }

    acceptRow() {
        this.viewCtrl.dismiss(this.row);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
