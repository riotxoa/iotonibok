import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';
import { SearchProductModalPage } from '../search-product-modal/search-product-modal';
import { OfferLineModalPage } from '../offer-line-modal/offer-line-modal';
import { OfferDiscountModalPage } from '../offer-discount-modal/offer-discount-modal';

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
        rows: [],
        discount: 0,
        gift: 0,
        amount: 1,
        total_price: 0,
        total_price_o: 0,
        total_valoracion: undefined,
    };
    products;
    searchItems;
    selected;
    totalClass;
    backgroundClass;

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public restService: RestServiceProvider, public alertCtrl: AlertController) {
        this.initializeState();
        this.products = [];
        this.searchItems = [];
        this.selected = 0;

    }

    initializeState() {
        this.restService.getProducts().then( data => {

            this.products = JSON.parse(JSON.stringify(data));

            this.searchItems = this.products.map((val, key) => {
                let item = {
                    index: key,
                    reference: val.reference + " (" + val.description + ")",
                };
                return item;
            });

            let state = localStorage.getItem('state');
            if(state) {
                state = JSON.parse(state);
                this.state = state;
                this.backgroundClass = "";
                this.totalClass = (this.state.total_valoracion ? "accepted" : "rejected");
            } else {
                this.state.discount = 0;
                this.state.gift = 0;
                this.state.amount = 1;
                this.state.total_valoracion = undefined;
                this.backgroundClass = "offerBackground";
                this.totalClass = "undefined";
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OfferPage');
    }

    presentSearchProductModal() {
        let searchProductModal = this.modalCtrl.create(SearchProductModalPage, {items: this.searchItems});

        searchProductModal.onDidDismiss(index => {
            if( index )
                this.addOfferLine(index);
        });

        searchProductModal.present();
    }

    addOfferLine(index) {
        let product = this.products[index];

        let row = {
            order: this.state.rows.length + 1,
            amount: 1,
            product: {
                id: null,
                reference: '',
                name: '',
                // margin: null,
                // cost: null,
                price_unit: null,
                price: null,
                file: null,
            },
            price_o: null,
            valoracion: undefined,
            discount: 0,
            gift: 0,
            selected: false,
        }


        row.product.id = product.id;
        row.product.reference = product.reference;
        row.product.name = product.description;
        // row.product.margin = product.margin;
        // row.product.cost = product.cost;
        row.product.price_unit = parseFloat(product.price).toFixed(2);
        row.product.price = (product.price * row.amount).toFixed(2);
        row.price_o = this.getPriceWithDiscount(product.price, this.state.discount);
        row.product.file = ((product.file != "" && product.file != 0) ? 1 : 0);

        // var row_margin = (row.price_o - (product.cost * row.amount))*100 / row.price_o;
        // row.valoracion = (row_margin >= product.margin ? 1 : 0);

        this.restService.getRowValoracion(row).then( response => {
            row.valoracion = response;
            this.addRow(row);
        });
    }

    getPriceWithDiscount(price, discount) {
        var priceWithDiscount = price;
        if (discount > 0) {
            priceWithDiscount = price * (1 -(discount/100));
        }

        return parseFloat(priceWithDiscount).toFixed(2);
    }

    refreshRows(discount, gift, amount) {
        var rows = this.state.rows;
        var total_price = 0;
        var total_price_o = 0;
        var total_valoracion = 0;

        rows.map((val,key) => {
            var row = this.state.rows[key];
            var rowDiscount = (row.discount ? row.discount : discount);

            row.price_o = this.getPriceWithDiscount(row.product.price, rowDiscount);

            total_price += parseFloat(row.product.price);
            total_price_o += parseFloat(row.price_o);
        });

        total_price = total_price * amount;
        total_price_o = total_price_o * amount;

        this.state.total_price = total_price;
        this.state.total_price_o = total_price_o;
        this.state.total_valoracion = total_valoracion;

        this.updateValoracionOffer();
    }

    addRow( data ) {
        this.backgroundClass = "";
        this.state.rows.push(data);
        this.incrTotals(data);
    }

    viewRowDetail( order ) {
        this.unselectAllRows();

        var index = this.state.rows.findIndex( r => r.order == order );
        var row = this.state.rows[index];

        let offerLineModal = this.modalCtrl.create(OfferLineModalPage, {row: row, discount: this.state.discount, calcPrice: this.getPriceWithDiscount});

        this.decrTotals(row);

        offerLineModal.onDidDismiss(data => {
            if( data ) {

                this.incrTotals(data);

                this.restService.getRowValoracion(data).then( response => {
                    data.valoracion = response;
                    this.state.rows[index] = data;
                });
            } else {
                this.incrTotals(row);
            }
        });
        offerLineModal.present();
    }

    viewOfferDetails() {
        let offerDiscountModal = this.modalCtrl.create(OfferDiscountModalPage, {offer: this.state});

        offerDiscountModal.onDidDismiss(data => {
            if( data ) {
                this.state.amount = data.amount;
                this.state.gift = data.gift;
                this.state.discount = data.discount;

                this.refreshRows(data.discount, data.gift, data.amount);
            }
        });
        offerDiscountModal.present();
    }

    viewSelectedRow() {
        var row = this.state.rows.find( r => r.selected == true );

        this.viewRowDetail( row.order );
    }

    selectAllRows() {
        this.state.rows.map((val,key) => this.state.rows[key].selected = true);

        this.selected = this.state.rows.length;
    }

    unselectAllRows() {
        var selectedRows = this.state.rows.filter( r => r.selected == true );

        selectedRows.map((val,key) => this.state.rows.find( r => r.order == val.order ).selected = false);

        this.selected = 0;
    }

    deleteRows() {
        var selectedRows = this.state.rows.filter( r => r.selected == true );

        selectedRows.map((val,key) => {
            var index = this.state.rows.findIndex( r => r.order == val.order );

            this.decrTotals(this.state.rows[index]);

            this.state.rows.splice(index, 1);
        });

        this.refreshRows(this.state.discount, this.state.gift, this.state.amount);

        this.selected = 0;
    }

    removeSelectedRows() {
        var confirm = this.alertCtrl.create({
            title: 'Borrar líneas',
            message: 'Se va a proceder al borrado de las líneas seleccionadas. ¿Desea continuar?',
            buttons: [
                {
                    text: 'Borrar',
                    handler: () => {
                        this.deleteRows();
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel',
                }
            ]
        });
        confirm.present();
    }

    selectRow( order ) {
        var row = this.state.rows.find( r => r.order == order );
        row.selected = !row.selected;

        var rowsSelected = this.state.rows.filter( r => r.selected == true );
        this.selected = rowsSelected.length;
    }

    incrTotals(data) {
        this.state.total_price += parseFloat(data.product.price);
        this.state.total_price_o += parseFloat(data.price_o);
        this.updateValoracionOffer();
    }

    decrTotals(data) {
        this.state.total_price -= parseFloat(data.product.price);
        this.state.total_price_o -= parseFloat(data.price_o);
        this.updateValoracionOffer();
    }

    updateValoracionOffer() {
        this.restService.getOfferValoracion(this.state).then( response => {
            this.totalClass = (response ? "accepted" : "rejected");
            this.state.total_valoracion = response;

            localStorage.setItem('state', JSON.stringify(this.state));
        });
    }

}
