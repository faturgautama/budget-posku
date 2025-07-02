import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

    Form: FormGroup;

    Features: any[] = [
        {
            id: 1,
            title: 'Fitur Penjualan Yang Kasir-friendly',
            description: 'Penjualan mudah dilakukan, dengan pintasan (shortcut) keyboard. Sehingga minim penggunaan mouse',
            image: '../../../assets/1.png',
        },
        {
            id: 2,
            title: 'Multi Metode Bayar',
            description: 'Upgrade metode bayar produk Anda. BUDGET POSku memiliki fitur multi payment method. ',
            image: '../../../assets/2.png',
        },
        {
            id: 3,
            title: 'Tampilan Struk Penjualan',
            description: 'Tersedia struk penjualan, hubungkan dengan printer Anda dan lakukan print dengan beberapa langkah saja.',
            image: '../../../assets/3.png',
        },
        {
            id: 4,
            title: 'Ekspor Data ke Excel',
            description: 'Ekspor data transaksi Anda ke excel, sehingga Anda dapat melakukan perincian dan perencanaan produk',
            image: '../../../assets/4.png',
        },
        {
            id: 5,
            title: 'Dukungan Offline',
            description: 'Provider internet Anda sedang bermasalah? Tidak masalah, karena BUDGET POSku dapat dijalankan secara offline',
            image: '../../../assets/5.png',
        },
    ];

    SelectedFeature: number = 0;

    constructor(
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
    ) {
        this.Form = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
    }

    onNavigateFeature(type: 'next' | 'prev', index: number): void {
        if (type == 'next') {
            if (index < this.Features.length - 1) {
                this.SelectedFeature += 1;
            } else {
                this.SelectedFeature = 0;
            }
        } else {
            if (index > -1) {
                this.SelectedFeature -= 1;
            } else {
                this.SelectedFeature = this.Features.length - 1
            }
        }
    }

    onSignIn(): void {
        if (this._utilityService.checkValidator(this.Form)) {
            // this._supabaseService.checkUser(this.Form.get('email')?.value, this.Form.get('password')?.value)
            //     .then((result) => {
            //         this._messageService.clear();

            //         if (result[0]) {
            //             this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Sign In Berhasil' });

            //             setTimeout(() => {
            //                 this.handlingAuth(result[1]);
            //             }, 1500);
            //         } else {
            //             this._messageService.add({ severity: 'error', summary: 'Oops', detail: result[1] })
            //         }
            //     });

            this.handlingAuth(null);
        }
    }

    onClickDemo(): void {
        window.open('https://api.whatsapp.com/send/?phone=6285156781165&text=Halo%20Saya%20Mau%20User%20Demo%20Budget%20POSKU')
    }

    private handlingAuth(data: any): void {
        localStorage.setItem('_BGPSUD_', JSON.stringify({ full_name: 'Admin', email: 'admin@unggas-berjaya.com' }));
        this._router.navigateByUrl('beranda');
    }
}
