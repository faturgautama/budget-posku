import { Component, OnInit } from '@angular/core';
import { CommonModule, formatCurrency, formatDate, formatNumber } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BankService } from 'src/app/service/bank.service';
import { DocumentService } from 'src/app/service/document.service';
import { UtilityService } from 'src/app/service/utility.service';
import { PembelianService } from 'src/app/service/pembelian.service';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-history-pembelian',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        InputTextModule,
        ButtonModule,
        MenuModule,
        GridComponent,
        ConfirmDialogModule
    ],
    templateUrl: './history-pembelian.component.html',
    styleUrls: ['./history-pembelian.component.scss']
})
export class HistoryPembelianComponent implements OnInit {

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

                this._documentService.exportToExcel('metodeBayar', column, this.GridProps.dataSource);
            }
        },
        {
            label: 'Export CSV',
            icon: 'pi pi-file',
            command: () => {
                const payload = {
                    worksheetName: 'Metode Bayar',
                    dataSource: this.GridProps.dataSource,
                };

                this._documentService.exportToCsv(payload);
            }
        }
    ];

    GridProps: GridModel.IGrid = {
        column: [
            { field: 'no_faktur', headerName: 'NO. FAKTUR', flex: 100, sortable: true, resizable: true, cellClass: 'text-blue-500 font-semibold' },
            { field: 'tanggal_pembelian', headerName: 'TGL. PEMBELIAN', flex: 150, sortable: true, resizable: true, cellRenderer: (e: any) => { return formatDate(e.value, 'dd-MM-yyyy HH:mm', 'EN') } },
            { field: 'nama_supplier', headerName: 'NAMA SUPPLIER', flex: 200, sortable: true, resizable: true },
            { field: 'jumlah_item', headerName: 'JUMLAH ITEM', flex: 120, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatNumber(e.value, 'EN') } },
            { field: 'grand_total', headerName: 'GRAND TOTAL', flex: 200, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') } },
            { field: 'status', headerName: 'STATUS', flex: 150, sortable: true, resizable: true, cellClass: 'text-center' },
        ],
        dataSource: [],
        height: "calc(100vh - 12rem)",
        showPaging: true,
        toolbar: []
    };

    GridSelectedData: any

    constructor(
        private _router: Router,
        private _messageService: MessageService,
        private _documentService: DocumentService,
        private _pembelianService: PembelianService,
        private _confirmationService: ConfirmationService,
    ) { }

    ngOnInit(): void {
        this.getData();
    }

    private getData(): void {
        this._pembelianService
            .getAll()
            .then((result) => {
                if (result[0]) {
                    this.GridProps.dataSource = result[1];
                }
            })
    }

    onRowDoubleClicked(args: any): void {
        console.log(args);
    }

    onCellClicked(args: any) {
        this.GridSelectedData = args;
    }

    onClickButtonAdd(): void {
        this._router.navigateByUrl('pembelian/input');
    }

    onClickButtonBatal() {
        if (this.GridSelectedData.status == "OPEN") {
            this._confirmationService.confirm({
                target: (<any>event).target as EventTarget,
                header: 'Apakah Anda Yakin? ',
                message: 'Data Akan Dibatalkan & Merubah Kartu Stok',
                icon: 'pi pi-question-circle',
                acceptButtonStyleClass: "p-button-danger p-button-sm",
                rejectButtonStyleClass: "p-button-secondary p-button-sm",
                acceptIcon: "none",
                acceptLabel: 'Iya, Batalkan',
                rejectIcon: "none",
                rejectLabel: 'Tidak, Kembali',
                accept: () => {
                    this._pembelianService
                        .cancel(this.GridSelectedData.id)
                        .then((result) => {
                            if (result[0]) {
                                this._messageService.clear();
                                this._messageService.add({ severity: 'success', summary: 'Berhasil', detail: 'Pembelian Berhasil Dibatalkan' });
                                this.getData();
                            }
                        })
                },
            });

        } else {
            this._messageService.clear();
            this._messageService.add({ severity: 'warn', summary: 'Oops', detail: 'Pembelian Sudah Dibatalkan' });
        }
    }
}
