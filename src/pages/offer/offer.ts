import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';
import { SearchProductModalPage } from '../search-product-modal/search-product-modal';
import { OfferLineModalPage } from '../offer-line-modal/offer-line-modal';
import { OfferDiscountModalPage } from '../offer-discount-modal/offer-discount-modal';
import { SendOfferModalPage } from '../send-offer-modal/send-offer-modal';
import { OpenOfferModalPage } from '../open-offer-modal/open-offer-modal';

/**
 * Generated class for the OfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 interface State {
     rows: any[],
     discount: number,
     gift: number,
     amount: number,
     total_price: number,
     total_price_o: number,
     total_valoracion: number,
 }

@IonicPage()
@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html',
})
export class OfferPage {
    state: State;
    products;
    searchProducts;
    selected;
    totalClass = "undefined";
    backgroundClass = "offerBackground";

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public restService: RestServiceProvider,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
    ) {
        this.initializeState();
        this.products = [];
        this.searchProducts = [];
        this.selected = 0;

    }

    initializeState() {
        this.state = {
            rows: [],
            discount: 0,
            gift: 0,
            amount: 1,
            total_price: 0,
            total_price_o: 0,
            total_valoracion: undefined,
        };
        this.getProducts();
    }

    getProducts() {
        let loading = this.loadingCtrl.create({
            content: 'Cargando productos...'
        });
        loading.present();

        this.restService.getProducts().then( data => {

            this.products = JSON.parse(JSON.stringify(data));

            this.searchProducts = this.products.map((val, key) => {
                let item = {
                    index: key,
                    reference: val.reference,
                    description: val.description,
                    price: this.formatPrice(val.price),
                };
                return item;
            });

            if(localStorage.getItem('state')) {
                this.state = JSON.parse(localStorage.getItem('state'));
                if( this.state.rows.length ) {
                    this.backgroundClass = "noOfferBackground";
                    this.totalClass = (this.state.total_valoracion ? "accepted" : "rejected");
                }
            } else {
                this.state = {
                    rows: [],
                    discount: 0,
                    gift: 0,
                    amount: 1,
                    total_price: 0,
                    total_price_o: 0,
                    total_valoracion: undefined,
                };
                this.backgroundClass = "offerBackground";
                this.totalClass = "undefined";
            }

            loading.dismiss();
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OfferPage');
    }

    presentSearchProductModal() {
        let searchProductModal = this.modalCtrl.create(SearchProductModalPage, {items: this.searchProducts});

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
                reference: undefined,
                name: undefined,
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
        row.product.price_unit = parseFloat(product.price).toFixed(2);
        row.product.price = (product.price * row.amount).toFixed(2);
        row.price_o = this.getPriceWithDiscount(product.price, row.discount);
        row.product.file = ((product.file != "" && product.file != 0) ? 1 : 0);

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

            row.price_o = this.getPriceWithDiscount(row.product.price, row.discount);

            total_price += parseFloat(row.product.price);
            total_price_o += parseFloat(row.price_o);
        });

        total_price = total_price * amount;
        total_price_o = total_price_o * amount;

        this.state.total_price = total_price;
        this.state.total_price_o = parseFloat(this.getPriceWithDiscount(total_price_o, this.state.discount));
        this.state.total_valoracion = total_valoracion;

        this.updateValoracionOffer();
        localStorage.setItem('state', JSON.stringify(this.state));
    }

    addRow( data ) {
        this.backgroundClass = "noOfferBackground";
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

        this.backgroundClass = (this.state.rows.length ? this.backgroundClass : "offerBackground");
        this.totalClass = (this.state.rows.length ? this.totalClass : "undefined");

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

        this.refreshRows(this.state.discount, this.state.gift, this.state.amount);

        this.updateValoracionOffer();
    }

    decrTotals(data) {
        this.state.total_price -= parseFloat(data.product.price);
        this.state.total_price_o -= parseFloat(data.price_o);

        this.refreshRows(this.state.discount, this.state.gift, this.state.amount);

        this.updateValoracionOffer();
    }

    updateValoracionOffer() {
        this.restService.getOfferValoracion(this.state).then( (response: number) => {
            this.totalClass = (response ? "accepted" : "rejected");
            this.state.total_valoracion = response;

            localStorage.setItem('state', JSON.stringify(this.state));
        });
    }

    clickSendOffer() {
        if( this.state.rows.length ) {
            this.viewSendOfferModal();
        } else {
            let alert = this.alertCtrl.create({
                title: 'Enviar oferta',
                subTitle: 'Debe añadir al menos una línea al pedido para poder enviarlo.',
                buttons: ['Aceptar']
            });
            alert.present();
        }
    }

    viewSendOfferModal() {
        let sendOfferModal = this.modalCtrl.create(SendOfferModalPage, {offer: this.state});

        sendOfferModal.onDidDismiss(data => {
            if( data ) {
                let loading = this.loadingCtrl.create({
                    content: 'Enviando...'
                });
                loading.present();
                this.restService.sendOffer(data).then( response => {
                    loading.dismiss();
                    let alert = this.alertCtrl.create({
                        title: (this.state.total_valoracion ? 'Enviar Pedido' : 'Enviar Consulta'),
                        subTitle: 'Envío realizado.',
                        buttons: ['Aceptar']
                    });
                    alert.present();
                })
                .catch( err => {
                    console.log("[viewSendOfferModal] error: " + JSON.stringify(err));
                    loading.dismiss();
                    let alert = this.alertCtrl.create({
                        title: 'Enviar oferta',
                        subTitle: 'Se ha producido un error al registrar la oferta. Consulte con la Gerencia de Ventas el estado del envío y vuelva a intentarlo si procede. ',
                        buttons: ['Aceptar']
                    });
                    alert.present();
                });
            }
        });
        sendOfferModal.present();
    }

    openOffer() {
        let openOfferModal = this.modalCtrl.create(OpenOfferModalPage);

        openOfferModal.onDidDismiss(id => {
            if( id ) {
                this.loadOffer(id);
            }
        });

        openOfferModal.present();
    }

    loadOffer(id) {
        let loading = this.loadingCtrl.create({
            content: 'Cargando...'
        });
        loading.present();

        this.restService.openOffer(id).then( (response: State) => {
            console.log("[loadOffer] response: " + JSON.stringify(response));
            loading.dismiss();

            this.state = response;

            this.backgroundClass = "noOfferBackground";
            this.totalClass = (this.state.total_valoracion ? "accepted" : "rejected");
            this.refreshRows(this.state.discount, this.state.gift, this.state.amount);

            let toast = this.toastCtrl.create({
                message: 'Oferta cargada',
                duration: 1500,
                cssClass: 'toast'
            });
            toast.present();
        })
        .catch( err => {
            console.log("[loadOffer] error: " + JSON.stringify(err));
            loading.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Abrir oferta',
                subTitle: 'Se ha producido un error al abrir la oferta. Inténtelo de nuevo o consulte con el Administrador. ',
                buttons: ['Aceptar']
            });
            alert.present();
        });
    }

    dialogSaveOffer() {
        var saveDialog = this.alertCtrl.create({
            title: 'Guardar oferta',
            message: 'Asigne un nombre para identificar a la oferta:',
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Nombre identificativo',
                }
            ],
            buttons: [
                {
                    text: 'Guardar',
                    handler: (data) => {
                        this.confirmSaveOffer(data.name);
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel',
                }
            ]
        });
        saveDialog.present();
    }

    confirmSaveOffer(name) {
        this.restService.checkOfferName(name).then( response => {
            if(response) {
                console.log("[confirmSaveOffer] response: " + JSON.stringify(response));
                this.confirmUpdateOffer(response, name);
            } else {
                console.log("[confirmSaveOffer] xxxxx: " + JSON.stringify(response));
                this.saveOffer(name);
            }

            let toast = this.toastCtrl.create({
                message: 'Oferta guardada',
                duration: 1500,
                cssClass: 'toast'
            });
            toast.present();
        })
        .catch( err => {
            console.log("[confirmSaveOffer] error: " + JSON.stringify(err));
            let alert = this.alertCtrl.create({
                title: 'Guardar oferta',
                subTitle: 'Se ha producido un error al guardar la oferta. Inténtelo de nuevo o consulte con el Administrador. ',
                buttons: ['Aceptar']
            });
            alert.present();
        });
    }

    confirmUpdateOffer(id, name) {
        var confirm = this.alertCtrl.create({
            title: 'Sobreescribir oferta guardada',
            message: 'Se va a proceder a sobreescribir la oferta ' + name + '. ¿Desea continuar?',
            buttons: [
                {
                    text: 'Sobreescribir',
                    handler: () => {
                        this.updateOffer(id, name);
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

    updateOffer(id, name) {
        var offer = new FormData();

        offer.append('name', name);
        offer.append('discount', String(this.state.discount));
        offer.append('gift', String(this.state.gift));
        offer.append('amount', String(this.state.amount));
        offer.append('lines', JSON.stringify(this.state.rows));
        offer.append('_method', 'PATCH');

        this.restService.updateOffer(id, offer).then( response => {
            let toast = this.toastCtrl.create({
                message: 'Oferta actualizada',
                duration: 1500,
                cssClass: 'toast'
            });
            toast.present();
        })
        .catch( err => {
            console.log("[updateOffer] error: " + JSON.stringify(err));
            let alert = this.alertCtrl.create({
                title: 'Actualizar oferta',
                subTitle: 'Se ha producido un error al actualizar la oferta guardada. Inténtelo de nuevo o consulte con el Administrador. ',
                buttons: ['Aceptar']
            });
            alert.present();
        });
    }

    saveOffer(name) {
        var offer = {
            name: name,
            discount: this.state.discount,
            gift: this.state.gift,
            amount: this.state.amount,
            lines: JSON.stringify(this.state.rows),
        };

        this.restService.saveOffer(name, offer).then( response => {
            let toast = this.toastCtrl.create({
                message: 'Oferta guardada',
                duration: 1500,
                cssClass: 'toast'
            });
            toast.present();
        })
        .catch( err => {
            console.log("[saveOffer] error: " + JSON.stringify(err));
            let alert = this.alertCtrl.create({
                title: 'Guardar oferta',
                subTitle: 'Se ha producido un error al guardar la oferta. Inténtelo de nuevo o consulte con el Administrador. ',
                buttons: ['Aceptar']
            });
            alert.present();
        });
    }

    formatPrice(price, currency = 'EUR', locale = 'es-ES', minimumFractionDigits = 2) {
        if (isNaN(price)) {
            return price;
	    }
        return parseFloat(price).toLocaleString(locale, {style: 'decimal', minimumFractionDigits});
    }
}
