import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform, ViewController } from 'ionic-angular';

/**
 * Generated class for the AddLineModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-line-modal',
  templateUrl: 'add-line-modal.html',
})
export class AddLineModalPage {

    items;
    searchResults;

    constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController) {
        this.items = navParams.data.items;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddLineModalPage');
    }

    getItems(ev) {
        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.searchResults = this.items.filter((item) => {
                return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        } else {
            this.clearSearchResults();
        }
    }

    clearSearchResults() {
        this.searchResults = [];
    }

    selectItem(ev) {
        console.log("Seleccionar " + JSON.stringify(ev));
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
