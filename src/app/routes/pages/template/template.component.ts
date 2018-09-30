import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { SettingsService } from '@delon/theme';
import { TeamService } from '../../function/team.service';
import { NzMessageService } from 'ng-zorro-antd';
import { LocalStorage } from '../../../core/local.storage';

@Component({
    selector: 'app-pages-template',
    templateUrl: './template.component.html',
    providers: [TeamService, LocalStorage]
})

export class TemplateComponent implements OnInit {
    validateForm: FormGroup;

    _submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[ i ].markAsDirty();
        }
    }

    constructor(private fb: FormBuilder,
                private _teamService: TeamService,
                private msg: NzMessageService,
                private _localStorage: LocalStorage,
                private _router: Router) {

    }

    updateConfirmValidator() {
        /** wait for refresh value */

    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        }
    }

    getCaptcha(e: MouseEvent) {
        e.preventDefault();
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            name             : [ null, [ Validators.required ] ],
            alias            : [ null ],
            user             : [ null ],
            stage            : [ null ]
        });
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onCreateTemplate() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            this._router.navigate(['/passport/login']);
            return;
        }
        const userName = currentUser.user.username;
        const name = this.getFormControl('name').value;
        const alias = this.getFormControl('alias').value;
        const user = this.getFormControl('user').value;
        const stage = this.getFormControl('stage').value;

        this._teamService.createTemplate({
            user: userName, name: name, alias: alias, status: false, stage: stage}).subscribe(data => {
            this._router.navigate(['/function/myTemplates']);
        });

    }

    onCancel() {
        this._router.navigate(['function/myTemplates']);
    }
}
