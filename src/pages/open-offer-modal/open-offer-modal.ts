import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

/**
 * Generated class for the OpenOfferModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-open-offer-modal',
  templateUrl: 'open-offer-modal.html',
})
export class OpenOfferModalPage {

    offers;
    searchResults;

    constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public restService: RestServiceProvider) {
        this.offers = [];
        this.searchResults = [];
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenOfferModalPage');
        this.getOffers();
    }

    getOffers() {
        this.restService.getOffers().then( data => {
            console.log("[getOffers] data: " + JSON.stringify(data));
            this.offers = JSON.parse(JSON.stringify(data));
            this.initializeSearchResults(this.offers);
        });
    }

    initializeSearchResults(rows) {
        this.searchResults = rows.map((val,key) => {
            let offer = {
                index: key,
                id: val.id,
                name: val.name,
            };
            return offer;
        });
    }

    getItems(ev) {
        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.searchResults = this.offers.filter((item) => {
                return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        } else {
            this.clearsearchResults();
        }
    }

    clearsearchResults() {
        this.searchResults = this.offers;
    }

    selectItem(id) {
        this.viewCtrl.dismiss(id);
    }

    confirmDeleteItem(event, index, id) {
        event.stopPropagation();
        var confirm = this.alertCtrl.create({
            title: 'Borrar líneas',
            message: 'Se va a proceder al borrado de la oferta seleccionada. ¿Desea continuar?',
            buttons: [
                {
                    text: 'Borrar',
                    handler: () => {
                        this.deleteOffer(index, id);
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

    deleteOffer(index, id) {
        let loading = this.loadingCtrl.create({
            content: 'Borrando...'
        });
        loading.present();
        this.restService.deleteOffer(id).then( response => {
            loading.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Borrar oferta',
                subTitle: 'Operación realizada.',
                buttons: ['Aceptar']
            });
            alert.present();

            this.offers.splice(index,1);
            this.initializeSearchResults(this.offers);
        })
        .catch( err => {
            console.log("[viewSendOfferModal] error: " + JSON.stringify(err));
            loading.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Borrar oferta',
                subTitle: 'Se ha producido un error al borrar la oferta. Vuelva a intentarlo. ',
                buttons: ['Aceptar']
            });
            alert.present();
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
