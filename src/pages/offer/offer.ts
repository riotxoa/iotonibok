import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AddLineModalPage } from '../add-line-modal/add-line-modal';

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

    items;

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
        this.initializeItems();
    }

    initializeItems() {
        this.items = [
            'Angular 1.x',
            'Angular 2',
            'ReactJS',
            'EmberJS',
            'Meteor',
            'Typescript',
            'Dart',
            'CoffeeScript'
        ];
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OfferPage');
    }

    presentAddLineModal() {
        let modal = this.modalCtrl.create(AddLineModalPage, {items: this.items});
        modal.present();
    }

}
