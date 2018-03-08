import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KitsPage } from './kits';

@NgModule({
  declarations: [
    KitsPage,
  ],
  imports: [
    IonicPageModule.forChild(KitsPage),
  ],
})
export class KitsPageModule {}
