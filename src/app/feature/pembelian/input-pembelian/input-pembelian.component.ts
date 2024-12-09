import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { PembelianService } from 'src/app/service/pembelian.service';
import { UtilityService } from 'src/app/service/utility.service';
import { MessageService } from 'primeng/api';
import { BarangService } from 'src/app/service/barang.service';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';
import { DialogModule } from 'primeng/dialog';

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
    ]
})
export class InputPembelianComponent implements OnInit {

    Form: FormGroup;

    FormDetail: FormGroup;

    IsFormDetailInsert = true;

    ShowFormDetailDialog = false;

    BarangDatasource: any[] = [];

    GridProps: GridModel.IGrid = {
        column: [
            { field: 'nama_barang', headerName: 'NAMA PRODUCT', flex: 150, sortable: true, resizable: true },
            { field: 'qty', headerName: 'QTY', flex: 150, sortable: true, resizable: true },
            { field: 'harga_beli', headerName: 'HARGA BELI', flex: 150, sortable: true, resizable: true },
            { field: 'total', headerName: 'TOTAL', flex: 150, sortable: true, resizable: true },
        ],
        dataSource: [],
        height: "calc(100vh - 21rem)",
        showPaging: true,
        toolbar: ['Add', 'Edit', 'Delete']
    };

    constructor(
        private _formBuilder: FormBuilder,
        private _barangService: BarangService,
        private _utilityService: UtilityService,
        private _messageService: MessageService,
        private _pembelianService: PembelianService,
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
    }

    private getAllBarang() {
        this._barangService
            .getAll()
            .then((result) => {
                this.BarangDatasource = result[0] ? result[1] : [];
            })
    }

    handleToolbarClicked(args: any) {
        if (args.id == 'add') {
            this.IsFormDetailInsert = true;
            this.ShowFormDetailDialog = true;
        }
    }

    handleChangeDropdownBarang(args: any) {
        if (args.value) {
            this.FormDetail.get('id_barang')?.setValue(args.value.id_barang);
            this.FormDetail.get('nama_barang')?.setValue(args.value.nama_barang);
            this.FormDetail.get('nama_satuan')?.setValue(args.value.nama_satuan);
        }
    }

    handleCountTotalDetail(args: any) {
        const qty = this.FormDetail.get('qty')?.value, harga_beli = this.FormDetail.get('harga_beli')?.value;
        let total = qty * harga_beli;
        console.log("total =>", total);
    }

    handleSaveDetail(args: any) {
        this.GridProps.dataSource = [
            ...this.GridProps.dataSource,
            { urut: this.GridProps.dataSource.length + 1, ...args }
        ];
    }

    handleEditDetail(args: any) {

    }
}
