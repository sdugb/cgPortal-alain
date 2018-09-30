import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { _HttpClient, } from '@delon/theme';

@Injectable()
export class UserService {
    login(username, password) {
        let body = {'username': username, 'password': password};
        return this.http
            .post('cgserver/login', body)
            .pipe(catchError(this.handleError));
    }

    login_register(username, password) {
        console.log(username);
        let body = {'username': username, 'password': password};
        return this.http
            .post('cgserver/login_register', body)
            .pipe(catchError(this.handleError));
    }

    handleError(error: any) {
        console.log('handleError..0.', error);
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    constructor(private http: _HttpClient) {
    }
}
