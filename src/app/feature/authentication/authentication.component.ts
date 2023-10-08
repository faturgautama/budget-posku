import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/service/supabase.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { UtilityService } from 'src/app/service/utility.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-authentication',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule
    ],
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

    Form: FormGroup

    constructor(
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _supabaseService: SupabaseService,
    ) {
        this.Form = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]]
        })
    }

    ngOnInit(): void {
    }

    onSignIn(): void {
        if (this._utilityService.checkValidator(this.Form)) {
            this._supabaseService.checkUser(this.Form.get('email')?.value, this.Form.get('password')?.value)
                .then((result) => {
                    this._messageService.clear();

                    if (result[0]) {
                        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Sign In Berhasil' });

                        setTimeout(() => {
                            this.handlingAuth(result[1]);
                        }, 1500);
                    } else {
                        this._messageService.add({ severity: 'error', summary: 'Oops', detail: result[1] })
                    }
                });
        }
    }

    private handlingAuth(data: any): void {
        localStorage.setItem('_BGPSUD_', JSON.stringify(data));
        this._router.navigateByUrl('beranda');
    }
}
