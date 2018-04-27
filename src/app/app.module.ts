import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { OfferPage } from '../pages/offer/offer';
import { KitsPage } from '../pages/kits/kits';
import { SearchProductModalPage } from '../pages/search-product-modal/search-product-modal';
import { OfferLineModalPage } from '../pages/offer-line-modal/offer-line-modal';
import { OfferDiscountModalPage } from '../pages/offer-discount-modal/offer-discount-modal';
import { SendOfferModalPage } from '../pages/send-offer-modal/send-offer-modal';
import { OpenOfferModalPage } from '../pages/open-offer-modal/open-offer-modal';
import { ProductsPage } from '../pages/products/products';
import { ProductDetailModalPage } from '../pages/product-detail-modal/product-detail-modal';

import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Clipboard } from '@ionic-native/clipboard';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { RestServiceProvider } from '../providers/rest-service/rest-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MainPage,
    OfferPage,
    KitsPage,
    SearchProductModalPage,
    OfferLineModalPage,
    OfferDiscountModalPage,
    SendOfferModalPage,
    OpenOfferModalPage,
    ProductsPage,
    ProductDetailModalPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MainPage,
    OfferPage,
    KitsPage,
    SearchProductModalPage,
    OfferLineModalPage,
    OfferDiscountModalPage,
    SendOfferModalPage,
    OpenOfferModalPage,
    ProductsPage,
    ProductDetailModalPage,
  ],
  providers: [
    StatusBar,
    SplashScreen, AuthServiceProvider, Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    RestServiceProvider,
    UniqueDeviceID,
    Clipboard,
  ]
})
export class AppModule {}
