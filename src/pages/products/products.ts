import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';
import { ProductDetailModalPage } from '../product-detail-modal/product-detail-modal';

/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
    products;
    searchResults;
    searchProducts;
    selected;
    totalClass = "undefined";
    backgroundClass = "offerBackground";

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public restService: RestServiceProvider,
        public loadingCtrl: LoadingController,
    ) {
        this.products = [];
        this.searchResults = [];
        this.selected = 0;

    }

    getProducts() {
        let loading = this.loadingCtrl.create({
            content: 'Cargando productos...'
        });
        loading.present();

        var ss_products = sessionStorage.getItem('products');

        if( ss_products ) {
            var products = JSON.parse(ss_products);
            this.initializeProducts(products);
            loading.dismiss();
        } else {
            this.restService.getProducts().then( data => {
                sessionStorage.setItem('products', JSON.stringify(data));
                var products = JSON.parse(JSON.stringify(data));
                this.initializeProducts(products);
                loading.dismiss();
            });
        }
    }

    initializeProducts(products) {
        this.products = products.map((val, key) => {
            let item = {
                index: key,
                id: val.id,
                reference: val.reference,
                description: val.description,
                currency: val.currency,
                unit: val.unit,
                amount: val.amount,
                price: this.formatPrice(val.price),
            };
            return item;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProductsPage');
        this.getProducts();
    }

    getItems(ev) {
        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.searchResults = this.products.filter((item) => {
                return (item.reference.toLowerCase().indexOf(val.toLowerCase()) == 0);
                // return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        } else {
            this.clearSearchResults();
        }
    }

    clearSearchResults() {
        this.searchResults = [];
    }

    selectItem(index) {
        let productDetailModal = this.modalCtrl.create(ProductDetailModalPage, {product: this.products[index]});

        productDetailModal.present();
    }

    formatPrice(price, currency = 'EUR', locale = 'es-ES', minimumFractionDigits = 2) {
        if (isNaN(price)) {
            return price;
	    }
        return parseFloat(price).toLocaleString(locale, {style: 'decimal', minimumFractionDigits});
    }
}
