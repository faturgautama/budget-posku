import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { MessageService } from 'primeng/api';
import { BankService } from 'src/app/service/bank.service';
import { DocumentService } from 'src/app/service/document.service';
import { UtilityService } from 'src/app/service/utility.service';
import { KartuStokService } from 'src/app/service/kartu-stok.service';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-kartu-stok',
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
        DialogModule,
    ],
    templateUrl: './kartu-stok.component.html',
    styleUrls: ['./kartu-stok.component.scss']
})
export class KartuStokComponent implements OnInit {

    FormState: 'list' | 'new' | 'update' = 'list';

    items = [
        {
            label: 'Export Excel',
            icon: 'pi pi-file-excel',
            command: () => {
                let column: any[] = [
                    {
                        header: 'ID',
                        key: 'id',
                        width: 20,
                    },
                    {
                        header: 'BANK',
                        key: 'bank',
                        width: 20,
                    }
                ]

                this._documentService.exportToExcel('kartuStok', column, this.GridProps.dataSource);
            }
        },
        {
            label: 'Export CSV',
            icon: 'pi pi-file',
            command: () => {
                const payload = {
                    worksheetName: 'Kartu Stok Barang',
                    dataSource: this.GridProps.dataSource,
                };

                this._documentService.exportToCsv(payload);
            }
        }
    ];

    GridProps: GridModel.IGrid = {
        column: [
            { field: 'nama_barang', headerName: 'NAMA BARANG', flex: 150, sortable: true, resizable: true },
            { field: 'nama_satuan', headerName: 'NAMA SATUAN', flex: 150, sortable: true, resizable: true },
            { field: 'sisa_stok', headerName: 'SISA STOK', flex: 150, sortable: true, resizable: true, cellClass: 'text-end' },
        ],
        dataSource: [],
        height: "calc(100vh - 15rem)",
        showPaging: true,
        toolbar: ['Detail']
    };

    GridSelectedData: any;

    GridDetailProps: GridModel.IGrid = {
        column: [
            { field: 'ref_id', headerName: 'REF ID', flex: 100, sortable: true, resizable: true },
            { field: 'created_at', headerName: 'TANGGAL', flex: 150, sortable: true, resizable: true, cellRenderer: (e: any) => { return formatDate(e.value, 'dd-MM-yyyy HH:mm', 'EN') } },
            { field: 'keterangan', headerName: 'KETERANGAN', flex: 170, sortable: true, resizable: true },
            { field: 'saldo_awal', headerName: 'SALDO AWAL', flex: 130, sortable: true, resizable: true, cellClass: 'text-end' },
            { field: 'nilai_masuk', headerName: 'NILAI MASUK', flex: 130, sortable: true, resizable: true, cellClass: 'text-end' },
            { field: 'nilai_keluar', headerName: 'NILAI KELUAR', flex: 130, sortable: true, resizable: true, cellClass: 'text-end' },
            { field: 'saldo_akhir', headerName: 'SALDO AKHIR', flex: 130, sortable: true, resizable: true, cellClass: 'text-end' },
        ],
        dataSource: [],
        height: "calc(100vh - 20rem)",
        showPaging: false,
        toolbar: []
    };

    ShowDialogDetail = false;

    constructor(
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _documentService: DocumentService,
        private _kartuStokService: KartuStokService,
    ) { }

    ngOnInit(): void {
        this.getData();
    }

    private getData(): void {
        this._kartuStokService
            .getSaldoStokBarang()
            .then((result) => {
                if (result[0]) {
                    this.GridProps.dataSource = result[1];
                }
            })
    }

    onCellClicked(args: any) {
        this.GridSelectedData = args;
    }

    onRowDoubleClicked(args: any): void {
        this.getDetailKartuStok(args.id_barang);
    }

    onToolbarClicked(args: any) {
        if (args.id == 'detail') {
            this.getDetailKartuStok(this.GridSelectedData.id_barang);
        }
    }

    private getDetailKartuStok(id_barang: any) {
        this._kartuStokService
            .getKartuStokBarang(id_barang)
            .then((result) => {
                if (result[0]) {
                    this.ShowDialogDetail = true;
                    this.GridDetailProps.dataSource = result[1];
                }
            })
    }
}

