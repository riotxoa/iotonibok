import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';
import { SearchProductModalPage } from '../search-product-modal/search-product-modal';
import { OfferLineModalPage } from '../offer-line-modal/offer-line-modal';

/**
 * Generated class for the OfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html',
})
export class OfferPage {

    state = {
        products: [],
        searchItems: [],
        // rows: [],
        discount: 0,
        gift: 0,
        amount: 1,
        total_cost: 0,
        total_price: 0,
        total_price_o: 0,
        total_valoracion: 1,
    };
    selected;
    rows;
    titleClass;
    backgroundClass;

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public restService: RestServiceProvider) {
        this.initializeState();
        this.selected = [];
        this.rows = [];
        this.titleClass = "accepted";
        this.backgroundClass = "offerBackground";
    }

    initializeState() {
        this.restService.getProducts().then( data => {

            this.state.products = JSON.parse(JSON.stringify(data));

            this.state.searchItems = this.state.products.map((val, key) => {
                let item = {
                    index: key,
                    reference: val.reference + " (" + val.description + ")",
                };
                return item;
            });

            this.state.discount = 0;
            this.state.gift = 0;
            this.state.amount = 1;

        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OfferPage');
    }

    presentSearchProductModal() {
        let searchProductModal = this.modalCtrl.create(SearchProductModalPage, {items: this.state.searchItems});

        searchProductModal.onDidDismiss(index => {
            if( index )
                this.presentOfferLineModal(index);
        });

        searchProductModal.present();
    }

    presentOfferLineModal(index) {
        let product = this.state.products[index];

        let row = {
            order: this.rows.length + 1,
            amount: 1,
            product: {
                id: null,
                reference: '',
                name: '',
                margin: null,
                cost: null,
                price_unit: null,
                price: null,
                file: null,
            },
            price_o: null,
            valoracion: 1,
            discount: 0,
            gift: 0,
            selected: false,
        }


        row.product.id = product.id;
        row.product.reference = product.reference;
        row.product.name = product.description;
        row.product.margin = product.margin;
        row.product.cost = product.cost;
        row.product.price_unit = parseFloat(product.price).toFixed(2);
        row.product.price = (product.price * row.amount).toFixed(2);
        row.price_o = this.getPriceWithDiscount(product.price, this.state.discount);
        row.product.file = ((product.file != "" && product.file != 0) ? 1 : 0);

        var row_margin = (row.price_o - (product.cost * row.amount))*100 / row.price_o;
        row.valoracion = (row_margin >= product.margin ? 1 : 0);

        this.titleClass = (row.valoracion ? "accepted" : "rejected");

        this.addRow(row);

    }

    getPriceWithDiscount(price, discount) {
        var priceWithDiscount = price;
        if (discount > 0) {
            priceWithDiscount = price * (1 -(discount/100));
        }

        return parseFloat(priceWithDiscount).toFixed(2);
    }

    addRow( data ) {
        this.backgroundClass = "";

        this.rows.push(data);
    }

    viewRowDetail( index ) {
        this.unselectAllRows();

        var row = this.rows[index-1];

        let offerLineModal = this.modalCtrl.create(OfferLineModalPage, {row: row, discount: this.state.discount, calcPrice: this.getPriceWithDiscount});

        offerLineModal.onDidDismiss(data => {
            if( data )
                this.rows[index-1] = data;
        });
        offerLineModal.present();
    }

    unselectAllRows() {
        var selectedRows = [];
        selectedRows = this.rows.filter( r => r.selected == true );
        console.log("[unsalectAllrows] selectedRows: " + JSON.stringify(selectedRows));
        selectedRows.map((val,key) => this.rows[val.order-1].selected = false);
    }

    selectRow( index ) {
        this.rows[index-1].selected = !this.rows[index-1].selected;
    }

}
