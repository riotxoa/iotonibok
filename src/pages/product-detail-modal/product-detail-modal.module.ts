import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductDetailModalPage } from './product-detail-modal';

@NgModule({
  // declarations: [
  //   ProductDetailModalPage,
  // ],
  imports: [
    IonicPageModule.forChild(ProductDetailModalPage),
  ],
})
export class ProductDetailModalPageModule {}
