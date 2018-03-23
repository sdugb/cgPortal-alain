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
    templateUrl: './template.component.html'

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
            user              : [ null ],
            stage            : [ null ]
        });
    }

    getFormControl(name) {
        return this.validateForm.controls[ name ];
    }

    onCreateTeam() {

        console.log(this.getFormControl('name').value);
        console.log(this.getFormControl('alias').value);
        console.log(this.getFormControl('user').value);
        console.log(this.getFormControl('stage').value);

        let userName = this._localStorage.getObject('username');
        let name = this.getFormControl('name').value;
        let alias = this.getFormControl('alias').value;
        let user = this.getFormControl('user').value;
        let stage = this.getFormControl('stage').value;

        this._teamService.createTemplate({
            user: userName, name: name, alias: alias, status: false, stage: stage}).subscribe(data => {
            this._router.navigate(['/function/myTemplates']);
        });

    }

    onCancel() {
        this._router.navigate(['function/myTeams']);
    }
}
