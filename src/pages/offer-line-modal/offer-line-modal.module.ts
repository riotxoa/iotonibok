import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfferLineModalPage } from './offer-line-modal';

@NgModule({
  declarations: [
    OfferLineModalPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferLineModalPage),
  ],
})
export class OfferLineModalPageModule {}
