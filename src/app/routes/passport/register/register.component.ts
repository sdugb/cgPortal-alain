import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { PassportService } from '../passport.service';
import { LocalStorage } from '@core/local.storage';

@Component({
    selector: 'passport-register',
    templateUrl: './register.component.html',
    styleUrls: [ './register.component.less' ],
    providers: [ LocalStorage, PassportService ]
})
export class UserRegisterComponent implements OnDestroy {
    teamName: String;
    form: FormGroup;
    error = '';
    type = 0;
    loading = false;
    visible = false;
    status = 'pool';
    progress = 0;
    passwordProgressMap = {
        ok: 'success',
        pass: 'normal',
        pool: 'exception'
    };

    constructor(fb: FormBuilder,
                private router: Router,
                public msg: NzMessageService,
                private _localStorage: LocalStorage,
                private _passportService: PassportService) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(2)]],
            mail: [null, [Validators.email]],
            password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
            confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]],
            mobilePrefix: [ '+86' ],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]]
        });
    }

    static checkPassword(control: FormControl) {
        if (!control) return null;
        const self: any = this;
        self.visible = !!control.value;
        if (control.value && control.value.length > 9)
            self.status = 'ok';
        else if (control.value && control.value.length > 5)
            self.status = 'pass';
        else
            self.status = 'pool';

        if (self.visible) self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }

    static passwordEquar(control: FormControl) {
        if (!control || !control.parent) return null;
        if (control.value !== control.parent.get('password').value) {
            return { equar: true };
        }
        return null;
    }

    // region: fields

    get userName() { return this.form.controls.userName; }
    get mail() { return this.form.controls.mail; }
    get password() { return this.form.controls.password; }
    get confirm() { return this.form.controls.confirm; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    submit() {
        this.loading = true;
        console.log('submit');
        this._passportService.register(this.userName.value, this.password.value).subscribe((res: any) => {
            this.loading = false;
            this.router.navigate(['/passport/login']);
        }, error => {
            this.error = `账户或密码错误`;
        });
        /*
        this.loading = true;
        this._passportService.login().subscribe(data => {
            this.teamName = data;
            console.log('teamName =', this.teamName);
            this._localStorage.setObject('teamName', this.teamName);
            this._passportService.register(this.username.value, this.password.value, this.teamName).subscribe((res: any) => {
                console.log('res =', res);
                this.loading = false;
                this.router.navigate(['/']);
            });
        });
        */
    }

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
