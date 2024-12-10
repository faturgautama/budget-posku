import { CommonModule, formatCurrency, formatNumber } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { PembelianService } from 'src/app/service/pembelian.service';
import { UtilityService } from 'src/app/service/utility.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BarangService } from 'src/app/service/barang.service';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-input-pembelian',
    templateUrl: './input-pembelian.component.html',
    styleUrls: ['./input-pembelian.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        CalendarModule,
        ButtonModule,
        DropdownModule,
        InputNumberModule,
        GridComponent,
        DialogModule,
        ConfirmDialogModule
    ]
})
export class InputPembelianComponent implements OnInit {

    Form: FormGroup;

    FormDetail: FormGroup;

    IsFormDetailInsert = true;

    ShowFormDetailDialog = false;

    BarangDatasource: any[] = [];

    @ViewChild('BarangDropdown') BarangDropdown!: Dropdown;

    GridProps: GridModel.IGrid = {
        column: [
            { field: 'nama_barang', headerName: 'NAMA PRODUCT', flex: 200, sortable: true, resizable: true },
            { field: 'nama_satuan', headerName: 'SATUAN', flex: 120, sortable: true, resizable: true },
            { field: 'qty', headerName: 'QTY', flex: 100, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatNumber(e.value, 'EN') } },
            { field: 'harga_beli', headerName: 'HARGA BELI', flex: 150, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') } },
            { field: 'total', headerName: 'TOTAL', flex: 150, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') } },
        ],
        dataSource: [],
        height: "calc(100vh - 29rem)",
        showPaging: false,
        toolbar: ['Add', 'Edit', 'Delete']
    };

    GridSelectedRow: any;

    constructor(
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _barangService: BarangService,
        private _utilityService: UtilityService,
        private _messageService: MessageService,
        private _pembelianService: PembelianService,
        private _confirmationService: ConfirmationService,
    ) {
        this.Form = this._formBuilder.group({
            tanggal_pembelian: [new Date(), [Validators.required]],
            no_faktur: ["", []],
            nama_supplier: ["", []],
            jumlah_item: [0, [Validators.required]],
            grand_total: [0, [Validators.required]],
            keterangan: ["", []],
        });

        this.FormDetail = this._formBuilder.group({
            urut: [0, [Validators.required]],
            id_barang: [0, [Validators.required]],
            nama_barang: ['', []],
            nama_satuan: ['', []],
            harga_beli: [0, [Validators.required]],
            qty: [0, [Validators.required]],
            total: [0, [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.getAllBarang();
        this.generateFaktur();
    }

    private getAllBarang() {
        this._barangService
            .getAll()
            .then((result) => {
                this.BarangDatasource = result[0] ? result[1] : [];
            })
    }

    private generateFaktur() {
        this._pembelianService
            .generateNoFaktur()
            .then((result) => {
                this.Form.get('no_faktur')?.setValue(result);
            })
    }

    handleToolbarClicked(args: any) {
        if (args.id == 'add') {
            this.IsFormDetailInsert = true;
            this.ShowFormDetailDialog = true;
            this.handleResetFormDetail();
        }

        if (args.id == 'edit') {
            this.IsFormDetailInsert = false;
            this.ShowFormDetailDialog = true;
            this.FormDetail.patchValue(this.GridSelectedRow);
        }

        if (args.id == 'delete') {
            this.handleDeleteDetail(this.GridSelectedRow.urut);
        }
    }

    handleCellClicked(args: any) {
        this.GridSelectedRow = args;
    }

    handleChangeDropdownBarang(args: any) {
        if (args.value) {
            this.FormDetail.get('id_barang')?.setValue(args.value.id);
            this.FormDetail.get('nama_barang')?.setValue(args.value.nama_barang);
            this.FormDetail.get('nama_satuan')?.setValue(args.value.nama_satuan);
        }
    }

    handleCountTotalDetail(args: any) {
        const qty = this.FormDetail.get('qty')?.value, harga_beli = this.FormDetail.get('harga_beli')?.value;
        let total = qty * harga_beli;
        this.FormDetail.get('total')?.setValue(total);
    }

    handleResetFormDetail() {
        this.FormDetail.reset();

        this.BarangDropdown.value = null;
        this.BarangDropdown.selectedOption = null;
        this.BarangDropdown.resetFilter();

        this.FormDetail = this._formBuilder.group({
            urut: [0, [Validators.required]],
            id_barang: [0, [Validators.required]],
            nama_barang: ['', []],
            nama_satuan: ['', []],
            harga_beli: [0, [Validators.required]],
            qty: [0, [Validators.required]],
            total: [0, [Validators.required]],
        });
    }

    handleSaveDetail(args: any) {
        args.urut = this.GridProps.dataSource.length + 1;
        this.GridProps.dataSource = [
            ...this.GridProps.dataSource,
            args
        ];
        this.ShowFormDetailDialog = false;
        this.handleCountFooter();
    }

    handleEditDetail(args: any) {
        const index = this.GridProps.dataSource.findIndex(item => item.urut == args.urut);
        let data = JSON.parse(JSON.stringify(this.GridProps.dataSource));
        data[index] = args;
        this.GridProps.dataSource = data;
        this.ShowFormDetailDialog = false;
        this.handleCountFooter();
    }

    handleDeleteDetail(urut: number) {
        let data = JSON.parse(JSON.stringify(this.GridProps.dataSource));
        data = data.filter((item: any) => { return item.urut != urut });
        this.GridProps.dataSource = data;
        this.handleCountFooter();
    }

    private handleCountFooter() {
        let jumlah_item = 0, grand_total = 0;

        this.GridProps.dataSource.forEach((item: any) => {
            item.qty = parseInt(item.qty);
            item.total = parseFloat(item.total);

            jumlah_item += item.qty;
            grand_total += item.total;
        });

        this.Form.get('jumlah_item')?.setValue(jumlah_item);
        this.Form.get('grand_total')?.setValue(grand_total);
    }

    handleBackToList() {
        this._router.navigateByUrl('pembelian/history');
    }

    handleSubmitForm() {
        const payload = {
            ...this.Form.value,
            detail: this.GridProps.dataSource.map((item: any) => {
                return {
                    id_barang: item.id_barang,
                    harga_beli: item.harga_beli,
                    qty: item.qty,
                    total: item.total,
                }
            })
        };

        this._confirmationService.confirm({
            target: (<any>event).target as EventTarget,
            header: 'Apakah Anda Yakin Data Sudah Benar? ',
            message: 'Data Akan Disimpan & Merubah Kartu Stok',
            icon: 'pi pi-question-circle',
            acceptButtonStyleClass: "p-button-info p-button-sm",
            rejectButtonStyleClass: "p-button-secondary p-button-sm",
            acceptIcon: "none",
            acceptLabel: 'Iya, Simpan',
            rejectIcon: "none",
            rejectLabel: 'Tidak, Cek Kembali',
            accept: () => {
                this._pembelianService
                    .insert(payload)
                    .then((result) => {
                        if (result[0]) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Pembelian Berhasil Disimpan' });

                            setTimeout(() => {
                                this.handleBackToList();
                            }, 1000);
                        } else {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'error', summary: 'Oops', detail: result[1] });
                        }
                    })
            },
        });
    }
}
