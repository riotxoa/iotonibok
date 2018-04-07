import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchProductModalPage } from './search-product-modal';

@NgModule({
  // declarations: [
  //   SearchProductModalPage,
  // ],
  imports: [
    IonicPageModule.forChild(SearchProductModalPage),
  ],
})
export class SearchProductModalPageModule {}
