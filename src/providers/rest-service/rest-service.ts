import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

// let apiUrl = 'http://localhost:8000/api/';
let apiUrl = 'http://54.36.99.89/api/';

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
            this.http.post(apiUrl + 'valoracion/row', row, {
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
            this.http.post(apiUrl + 'valoracion/offer', offer, {
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
    getClients() {
        return new Promise(resolve => {
            this.http.get(apiUrl + 'clients', {
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
    sendOffer(offer) {
        return new Promise( (resolve, reject) => {
            this.http.post(apiUrl + 'orders', offer, { headers: this.headers })
            .subscribe(res => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }

    getOffers() {
        return new Promise(resolve => {
            this.http.get(apiUrl + 'offers', {
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

    deleteOffer(id) {
        return new Promise(resolve => {
            this.http.delete(apiUrl + 'offers/' + id, {
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

    openOffer(id) {
        return new Promise( (resolve, reject) => {
            this.http.get(apiUrl + 'offers/' + id + '/id', {
                headers: this.headers
            }).subscribe(
                data => {
                    resolve(data);
                },
                (err) => {
                    console.log(err);
                }
            );
        });
    }

    checkOfferName(name) {
        return new Promise( (resolve, reject) => {
            this.http.get(apiUrl + 'offers/' + name + '/name', {
                headers: this.headers
            }).subscribe(
                data => {
                    resolve(data);
                },
                (err) => {
                    console.log(err);
                }
            );
        });
    }

    updateOffer(id, offer) {
        return new Promise( (resolve, reject) => {
            this.http.post(apiUrl + 'offers/' + id, offer, {
                headers: this.headers
            }).subscribe(
                data => {
                    resolve(data);
                },
                (err) => {
                    console.log(err);
                }
            );
        });
    }

    saveOffer(name, offer) {
        return new Promise( (resolve, reject) => {
            this.http.post(apiUrl + 'offers', offer, {
                headers: this.headers
            }).subscribe(
                data => {
                    resolve(data);
                },
                (err) => {
                    console.log(err);
                }
            );
        });
    }

    getKits() {
        return new Promise(resolve => {
            this.http.get(apiUrl + 'kits', {
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

    getKit(id) {
        return new Promise(resolve => {
            this.http.get(apiUrl + `kits/${id}/id`, {
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
