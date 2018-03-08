import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLineModalPage } from './add-line-modal';

@NgModule({
  declarations: [
    AddLineModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddLineModalPage),
  ],
})
export class AddLineModalPageModule {}
