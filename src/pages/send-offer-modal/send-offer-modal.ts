import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides, AlertController, LoadingController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

/**
 * Generated class for the OfferDiscountModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-offer-modal',
  templateUrl: 'send-offer-modal.html',
})
export class SendOfferModalPage {

    offer;
    items;
    selected = 0;
    selectedItem;
    observaciones;
    searchItems;
    searchResults;
    @ViewChild(Slides) slides: Slides;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public restService: RestServiceProvider,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
    ) {
        this.offer = navParams.data.offer;
        this.getClients();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SendOfferModalPage');
        if( this.offer.total_valoracion )
            this.slides.lockSwipes(true);
        else
            this.selected = 1;
    }

    getItems(ev) {
        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.searchResults = this.searchItems.filter((item) => {
                return (item.reference.toLowerCase().indexOf(val.toLowerCase()) == 0);
            })
        } else {
            this.clearSearchResults();
        }
    }

    clearSearchResults() {
        this.searchResults = [];
    }

    getClients() {
        let loading = this.loadingCtrl.create({
            content: 'Cargando clientes...'
        });
        loading.present();

        var items = sessionStorage.getItem('clients');
        if(items) {
            this.items = JSON.parse(items);
            this.initializeSearchItems(this.items);
            loading.dismiss();
        } else {
            this.restService.getClients().then( data => {
                sessionStorage.setItem('clients', JSON.stringify(data));
                this.items = JSON.parse(JSON.stringify(data));
                this.initializeSearchItems(this.items);
                loading.dismiss();
            });
        }
    }

    initializeSearchItems(items) {
        this.searchItems = items.map((val, key) => {
            let item = {
                index: key,
                reference: val.name + " (" + val.address + ")",
            };
            return item;
        });
    }

    selectItem(index) {
        this.selectedItem = this.items[index];
        this.clearSearchResults();
        this.selected = 1;
    }

    setObservaciones(ev) {
        this.observaciones = ev.target.value;
    }

    back() {
        this.slides.slidePrev();
    }

    next() {
        var index = this.slides.getActiveIndex();
        if( !index && undefined === this.selectedItem && this.offer.total_valoracion ) {
            let alert = this.alertCtrl.create({
                title: 'Enviar Pedido',
                subTitle: 'Debe seleccionar un Cliente para poder formalizar el Pedido.',
                buttons: ['Aceptar']
            });
            alert.present();
        } else {
            this.slides.lockSwipes(false);
            this.slides.slideNext();
        }
    }

    send() {
        var lines = this.offer.rows.map( (val,key) => {
            var line = {
                amount: val.amount,
                id: val.product.id,
                reference: val.product.reference,
                name: val.product.name,
                price_unit: val.product.price_unit,
                final_price: val.product.price,
                discount: val.discount,
                gift: val.gift,
                authorized: (val.valoracion ? val.valoracion : 0)
            };

            return line;
        });
        var totals = {
            amount: this.offer.amount,
            cost: -1,
            price: this.offer.total_price,
            discount: this.offer.discount,
            gift: this.offer.gift,
            final_price: this.offer.total_price_o,
            authorized: this.offer.total_valoracion,
        };
        var order = {
            lines: lines,
            totals: totals,
        };
        var offer = {
            cliente: this.selectedItem,
            order: order,
            observaciones: this.observaciones,
        };
        this.viewCtrl.dismiss(offer);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    formatPrice(price, currency = 'EUR', locale = 'es-ES', minimumFractionDigits = 2) {
        if (isNaN(price)) {
            return price;
	    }
        return parseFloat(price).toLocaleString(locale, {style: 'decimal', minimumFractionDigits});
    }

}
