import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform, ViewController } from 'ionic-angular';

/**
 * Generated class for the SearchProductModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-product-modal',
  templateUrl: 'search-product-modal.html',
})
export class SearchProductModalPage {

    items;
    searchResults;

    constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController) {
        this.items = navParams.data.items;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchProductModalPage');
    }

    getItems(ev) {
        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.searchResults = this.items.filter((item) => {
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

    selectItem(ev) {
        this.viewCtrl.dismiss(ev);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
