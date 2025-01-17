import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';
import { UtilityService } from 'src/app/service/utility.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { BarangService } from 'src/app/service/barang.service';
import { SatuanService } from 'src/app/service/satuan.service';
import { ReplaySubject, from, map, of, takeUntil } from 'rxjs';
import { DocumentService } from 'src/app/service/document.service';

@Component({
    selector: 'app-setup-barang',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        MenuModule,
        DropdownModule,
        InputNumberModule,
        GridComponent,
    ],
    templateUrl: './setup-barang.component.html',
    styleUrls: ['./setup-barang.component.scss']
})
export class SetupBarangComponent implements OnInit, OnDestroy {

    Form: FormGroup;

    FormState: 'list' | 'new' | 'update' = 'list';

    items = [
        {
            label: 'Export Excel',
            icon: 'pi pi-file-excel',
            command: () => {
                let column: any[] = [
                    {
                        header: 'ID BARANG',
                        key: 'id',
                        width: 20,
                    },
                    {
                        header: 'NAMA BARANG',
                        key: 'nama_barang',
                        width: 20,
                    },
                    {
                        header: 'BARCODE',
                        key: 'barcode',
                        width: 20,
                    },
                    {
                        header: 'ID SATUAN',
                        key: 'id_satuan',
                        width: 20,
                    },
                    {
                        header: 'NAMA SATUAN',
                        key: 'nama_satuan',
                        width: 20,
                    },
                    {
                        header: 'JUMLAH STOK',
                        key: 'jumlah_stok',
                        width: 20,
                    },
                    {
                        header: 'HARGA JUAL',
                        key: 'harga_jual',
                        width: 20,
                    },
                ]

                this._documentService.exportToExcel('produk', column, this.GridProps.dataSource);
            }
        },
        {
            label: 'Export CSV',
            icon: 'pi pi-file',
            command: () => {
                const payload = {
                    worksheetName: 'Produk',
                    dataSource: this.GridProps.dataSource,
                };

                this._documentService.exportToCsv(payload);
            }
        }
    ];

    GridProps: GridModel.IGrid = {
        column: [
            { field: 'nama_barang', headerName: 'NAMA PRODUK', flex: 300, sortable: true, resizable: true },
            { field: 'barcode', headerName: 'BARCODE', flex: 150, sortable: true, resizable: true },
            { field: 'harga_jual', headerName: 'HARGA JUAL', flex: 150, sortable: true, resizable: true },
            { field: 'jumlah_stok', headerName: 'JUMLAH STOK', flex: 120, sortable: true, resizable: true },
        ],
        dataSource: [],
        height: "calc(100vh - 12rem)",
        showPaging: true,
        toolbar: []
    };

    Destroy$ = new ReplaySubject(0);

    Satuan$ = from(this._satuanService.getAll()).pipe(
        takeUntil(this.Destroy$),
        map((result: any) => {
            if (result[0]) {
                return result[1]
            } else {
                return []
            }
        })
    );

    constructor(
        private _formBuilder: FormBuilder,
        private _satuanService: SatuanService,
        private _barangService: BarangService,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _documentService: DocumentService,
    ) {
        this.Form = this._formBuilder.group({
            id: [0, []],
            nama_barang: ["", [Validators.required]],
            id_satuan: [0, [Validators.required]],
            barcode: ["", [Validators.required]],
            harga_jual: [0, [Validators.required]],
            jumlah_stok: [0, [Validators.required]],
        })
    }

    ngOnInit(): void {
        this.getData();
    }

    getData(): void {
        this._barangService.getAll()
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
        this.Form.get('nama_barang')?.setValue(args.nama_barang);
        this.Form.get('id_satuan')?.setValue(args.id_satuan);
        this.Form.get('barcode')?.setValue(args.barcode);
        this.Form.get('harga_jual')?.setValue(args.harga_jual);
        this.Form.get('jumlah_stok')?.setValue(args.jumlah_stok);
    }

    onClickButtonAdd(): void {
        this.FormState = 'new';
        this.Form.reset();
    }

    handleSave(): void {
        if (this._utilityService.checkValidator(this.Form)) {
            this._barangService.insert(this.Form.value)
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
        this._barangService.update(this.Form.value)
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

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }
}
