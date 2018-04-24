import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

/**
 * Generated class for the KitsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kits',
  templateUrl: 'kits.html',
})
export class KitsPage {

  kits;
  searchResults;
  selectedKit;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public restService: RestServiceProvider) {
     this.kits = [];
     this.searchResults = [];
     this.selectedKit = {
         name: '',
         description: '',
         lines: [],
     }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KitsPage');
    this.kits = (this.kits.length ? this.kits : this.getKits());
  }

  getKits() {
      this.restService.getKits().then( data => {
          this.kits = JSON.parse(JSON.stringify(data));
          this.initializeSearchResults(this.kits);
      });
  }

  getKit(id) {
      this.restService.getKit(id).then( data => {
          let kit = JSON.parse(JSON.stringify(data));

          this.selectedKit.name = kit.name;
          this.selectedKit.description = kit.description;
          this.selectedKit.lines = kit.lines;
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
          this.searchResults = this.kits.filter((item) => {
              return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
      } else {
          this.clearSearchResults();
      }
  }

  clearSearchResults() {
      this.searchResults = this.kits;
  }

  selectItem(id) {
      console.log("[selectItem] id: " + id);
      this.getKit(id);
  }

  goBack() {
      console.log("[goBAck]");
      this.selectedKit.lines = [];
  }

}
