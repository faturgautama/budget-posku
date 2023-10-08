import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate, formatNumber } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { SatuanService } from 'src/app/service/satuan.service';
import { MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { UtilityService } from 'src/app/service/utility.service';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';

@Component({
    selector: 'app-setup-satuan',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        MenuModule,
        GridComponent,
    ],
    templateUrl: './setup-satuan.component.html',
    styleUrls: ['./setup-satuan.component.scss']
})
export class SetupSatuanComponent implements OnInit {

    Form: FormGroup;

    FormState: 'list' | 'new' | 'update' = 'list';

    items = [
        {
            label: 'Export Excel',
            icon: 'pi pi-file-excel',
            command: () => {
                // this.update();
            }
        },
        {
            label: 'Export Pdf',
            icon: 'pi pi-file-pdf',
            command: () => {
                // this.delete();
            }
        }
    ];

    GridProps: GridModel.IGrid = {
        column: [
            { field: 'nama_satuan', headerName: 'SATUAN', flex: 150, sortable: true, resizable: true },
            {
                field: 'isi', headerName: 'ISI', flex: 150, sortable: true, resizable: true,
                cellRenderer: (e: any) => { return e.value ? formatNumber(e.value, 'EN') : '' }
            },
        ],
        dataSource: [],
        height: "calc(100vh - 12rem)",
        showPaging: true,
        toolbar: []
    };

    constructor(
        private _formBuilder: FormBuilder,
        private _satuanService: SatuanService,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
    ) {
        this.Form = this._formBuilder.group({
            id: [0, []],
            nama_satuan: ['', [Validators.required]],
            isi: ['', [Validators.required]],
        })
    }

    ngOnInit(): void {
        this.getData();
    }

    getData(): void {
        this._satuanService.getAll()
            .then((result) => {
                if (result[0]) {
                    this.GridProps.dataSource = result[1];
                    this.Form.reset();
                }
            })
    }

    onRowDoubleClicked(args: any): void {
        this.FormState = 'update';
        this.Form.get('id')?.setValue(args.id);
        this.Form.get('nama_satuan')?.setValue(args.nama_satuan);
        this.Form.get('isi')?.setValue(args.isi);
    }

    onClickButtonAdd(): void {
        this.FormState = 'new';
        this.Form.reset();
    }

    handleSave(): void {
        if (this._utilityService.checkValidator(this.Form)) {
            this._satuanService.insert(this.Form.value)
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
        this._satuanService.update(this.Form.value)
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
