import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button';
import { LokasiService } from 'src/app/service/lokasi.service';
import { MessageService } from 'primeng/api';
import { UtilityService } from 'src/app/service/utility.service';

@Component({
    selector: 'app-setup-lokasi',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule
    ],
    templateUrl: './setup-lokasi.component.html',
    styleUrls: ['./setup-lokasi.component.scss']
})
export class SetupLokasiComponent implements OnInit {

    Form: FormGroup;

    FormState: 'new' | 'update' = 'new';

    constructor(
        private _formBuilder: FormBuilder,
        private _lokasiService: LokasiService,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
    ) {
        this.Form = this._formBuilder.group({
            id: [0, []],
            nama_lokasi: ['', [Validators.required]],
            alamat: ['', [Validators.required]],
            kota: ['', []],
            no_handphone: ['', []],
            social_media: ['', []],
        })
    }

    ngOnInit(): void {
        this.getData();
    }

    getData(): void {
        this._lokasiService.getAll()
            .then((result) => {
                if (result[0]) {
                    if (Object.keys(result[1]).length) {
                        this.FormState = 'update';

                        this.Form.get('id')?.setValue(result[1].id);
                        this.Form.get('nama_lokasi')?.setValue(result[1].nama_lokasi);
                        this.Form.get('alamat')?.setValue(result[1].alamat);
                        this.Form.get('kota')?.setValue(result[1].kota ? result[1].kota : "");
                        this.Form.get('no_handphone')?.setValue(result[1].no_handphone ? result[1].no_handphone : "");
                        this.Form.get('social_media')?.setValue(result[1].social_media ? result[1].social_media : "");
                    } else {
                        this.FormState = 'new'
                    }
                }
            })
    }

    handleSave(): void {
        if (this._utilityService.checkValidator(this.Form)) {
            this._lokasiService.insert(this.Form.value)
                .then((result) => {

                    this._messageService.clear();

                    if (result[0]) {
                        this._messageService.add({ severity: 'success', summary: 'Success', detail: result[1] })
                    } else {
                        this._messageService.add({ severity: 'error', summary: 'Oops', detail: result[1] })
                    }

                    this.getData();
                })
        }
    }

    handleUpdate(): void {
        this._lokasiService.update(this.Form.value)
            .then((result) => {
                this._messageService.clear();

                if (result[0]) {
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: result[1] })
                } else {
                    this._messageService.add({ severity: 'error', summary: 'Oops', detail: result[1] })
                }

                this.getData();
            })
    }
}
