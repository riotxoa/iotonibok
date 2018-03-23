import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

let apiUrl = 'http://localhost:8000/api/';

/*
  Generated class for the RestServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestServiceProvider {

    userData;
    headers;

    constructor(public http: HttpClient) {
        console.log('Hello RestServiceProvider Provider');

        this.initializeUserData();

    }

    initializeUserData() {
        var uData = JSON.parse(localStorage.getItem('userData'));

        if(uData) {
            this.userData = uData;
            this.headers = new HttpHeaders().set('Accept', 'aplication/json').set('Authorization', 'Bearer ' + this.userData.access_token);
        }
    }

    getProducts() {
        return new Promise(resolve => {
            this.http.get(apiUrl + 'products', {
                headers: this.headers,
            }).subscribe(
                data => {
                    resolve(data);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }
    getRowValoracion(row) {
        return new Promise(resolve => {
            var param = btoa(JSON.stringify(row))
            this.http.get(apiUrl + 'valoracion/row/' + param, {
                headers: this.headers,
            }).subscribe(
                data => {
                    resolve(data);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }
    getOfferValoracion(offer) {
        return new Promise(resolve => {
            var param = btoa(JSON.stringify(offer))
            this.http.get(apiUrl + 'valoracion/offer/' + param, {
                headers: this.headers,
            }).subscribe(
                data => {
                    resolve(data);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }
}
