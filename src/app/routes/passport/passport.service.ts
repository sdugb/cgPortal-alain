import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { _HttpClient, } from '@delon/theme';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class PassportService {
/*
    login(username, password) {
        // const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // const body = {'username': username, 'password': password};
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const myParams = new HttpParams();
        myParams.append('username', username);
        myParams.append('password', password);
        // const options = new RequestOptions({ headers: myHeaders, params: myParams });
        return this.http
            .get('api/users',  {headers: headers, params: myParams})
            .pipe(catchError(this.handleError));
    }
*/
    register(username, password) {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let body = new HttpParams();
        body = body.set('username', username);
        body = body.set('password', password);
        body = body.set('team', '');
        body = body.set('role', 'admin');
        return this.http
            .post('cgserver/register', body, {headers: headers})
            .pipe(catchError(this.handleError));
    }

    login(username, password) {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let body = new HttpParams();
        body = body.set('username', username);
        body = body.set('password', password);
        return this.http
            .post('cgserver/login', body, {headers: headers})
            .pipe(catchError(this.handleError));
    }

    /*
    login(username, password) {
        const body = {'username': username, 'password': password};
            console.log(body);
        return this.http
            .post('cgserver/login', body)
            .pipe(catchError(this.handleError));
    }

    register(username, password) {
        console.log('register');
        const body = {'username': username, 'password': password, 'teamName': '', 'role': 'admin'};
        return this.http
            .post('cgserver/register', body)
            .pipe(catchError(this.handleError));
    }

    getUserApps(systemID) {
        const url = 'cgserver/login' + systemID + '/apps';
        return this.http
            .get(url)
            .pipe(catchError(this.handleError));
    }
*/
    handleError(error: any) {
        console.log('error =', error.error.message);
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(error.error.message);
    }
/*
    constructor(private http: _HttpClient) {
    }
    */
    constructor(private http: HttpClient) {

    }
}
