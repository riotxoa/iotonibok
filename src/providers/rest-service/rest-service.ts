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
                });
        });
    }
}
