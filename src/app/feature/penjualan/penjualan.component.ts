import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, formatCurrency, formatDate } from '@angular/common';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';
import { UtilityService } from 'src/app/service/utility.service';
import { PenjualanService } from 'src/app/service/penjualan.service';
import { ReplaySubject, from, takeUntil, map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/service/document.service';

@Component({
    selector: 'app-penjualan',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        GridComponent,
        ButtonModule,
        MenuModule,
        TabViewModule
    ],
    templateUrl: './penjualan.component.html',
    styleUrls: ['./penjualan.component.scss']
})
export class PenjualanComponent implements OnInit, OnDestroy {

    GridProps: GridModel.IGrid = {
        column: [
            {
                field: 'tanggal_penjualan', headerName: 'TGL. PENJUALAN', flex: 150, sortable: true, resizable: true,
                cellRenderer: (e: any) => { return formatDate(e.value, 'dd/MM/yyyy HH:mm', 'EN') }
            },
            {
                field: 'no_faktur', headerName: 'NO. FAKTUR', flex: 150, sortable: true, resizable: true
            },
            {
                field: 'jumlah_item', headerName: 'JUMLAH ITEM', flex: 150, sortable: true, resizable: true,
                cellClass: 'text-end',
                cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', '') }
            },
            {
                field: 'grand_total', headerName: 'TOTAL', flex: 150, sortable: true, resizable: true,
                cellClass: 'text-end',
                cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') }
            },
            {
                field: 'ppn_rupiah', headerName: 'PPn', flex: 150, sortable: true, resizable: true,
                cellClass: 'text-end',
                cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') }
            },
            {
                field: 'total_transaksi', headerName: 'GRAND TOTAL', flex: 150, sortable: true, resizable: true,
                cellClass: 'text-end',
                cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') }
            },
        ],
        dataSource: [],
        height: "calc(100vh - 14rem)",
        showPaging: true,
        toolbar: ['Detail']
    };

    GridSelectedData: any;

    GridDetailProps: GridModel.IGrid = {
        column: [
            { field: 'nama_barang', headerName: 'NAMA PRODUK', flex: 300, sortable: true, resizable: true },
            { field: 'barcode', headerName: 'BARCODE', flex: 120, sortable: true, resizable: true },
            { field: 'qty', headerName: 'QTY', flex: 100, sortable: true, resizable: true, cellClass: 'text-end', },
            { field: 'harga_jual', headerName: 'HARGA JUAL', flex: 150, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') } },
            { field: 'total', headerName: 'TOTAL', flex: 120, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') } },
        ],
        dataSource: [],
        height: "calc(100vh - 23rem)",
        showPaging: false,
        toolbar: []
    };

    GridDetailPaymentProps: GridModel.IGrid = {
        column: [
            { field: 'metode_bayar', headerName: 'METODE BAYAR', flex: 200, sortable: true, resizable: true },
            { field: 'bank', headerName: 'BANK', flex: 150, sortable: true, resizable: true },
            { field: 'total', headerName: 'TOTAL TRANSAKSI', flex: 150, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') } },
            { field: 'jumlah_bayar', headerName: 'JUMLAH BAYAR', flex: 150, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') } },
            { field: 'kembalian', headerName: 'KEMBALI', flex: 150, sortable: true, resizable: true, cellClass: 'text-end', cellRenderer: (e: any) => { return formatCurrency(e.value, 'EN', 'Rp. ') } },
        ],
        dataSource: [],
        height: "calc(100vh - 23rem)",
        showPaging: false,
        toolbar: []
    };

    Destroy$ = new ReplaySubject(0);

    Penjualan$: any[] = []

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
                        header: 'TANGGAL PENJUALAN',
                        key: 'tanggal_penjualan',
                        width: 20,
                    },
                    {
                        header: 'NO. FAKTUR',
                        key: 'no_faktur',
                        width: 20,
                    },
                    {
                        header: 'JUMLAH ITEM',
                        key: 'jumlah_item',
                        width: 20,
                    },
                    {
                        header: 'TOTAL',
                        key: 'grand_total',
                        width: 20,
                    },
                    {
                        header: 'PPn',
                        key: 'ppn_rupiah',
                        width: 20,
                    },
                    {
                        header: 'GRAND TOTAL',
                        key: 'total_transaksi',
                        width: 20,
                    },
                ]

                this._documentService.exportToExcel('penjualan', column, this.GridProps.dataSource);
            }
        },
        {
            label: 'Export CSV',
            icon: 'pi pi-file',
            command: () => {
                const payload = {
                    worksheetName: 'Penjualan',
                    dataSource: this.GridProps.dataSource,
                };

                this._documentService.exportToCsv(payload);
            }
        }
    ];

    ToggleDetail = false;

    constructor(
        private _router: Router,
        private _utilityService: UtilityService,
        private _documentService: DocumentService,
        private _penjualanService: PenjualanService,
    ) { }

    ngOnInit(): void {
        this.getAll();
    }

    getAll(): void {
        from(this._penjualanService.getAll()).pipe(
            takeUntil(this.Destroy$),
            map((result: any) => {
                if (result[0]) {
                    return result[1]
                } else {
                    return []
                }
            })
        ).subscribe((result) => {
            console.log(result);
            this.GridProps.dataSource = result;
        })
    }

    getDetail(id: number): void {
        from(this._penjualanService.getDetail(id))
            .pipe(
                takeUntil(this.Destroy$),
                map((result: any) => {
                    if (result[0]) {
                        return result[1]
                    } else {
                        return []
                    }
                })
            ).subscribe((result) => {
                this.GridDetailProps.dataSource = result.detail[1];
                this.GridDetailPaymentProps.dataSource = result.detail_payment[1];
            })
    }

    handleToolbarClicked(args: any): void {
        if (args.id == "detail") {
            if (this.GridSelectedData) {
                this.ToggleDetail = true;
                this.getDetail(this.GridSelectedData.id);
            }
        }
    }

    handleCellClicked(args: any): void {
        this.GridSelectedData = args;
    }

    handleRowDoubleClicked(args: any): void {
        this.GridSelectedData = args;
        this.ToggleDetail = true;
        this.getDetail(this.GridSelectedData.id);
    }

    navigateToPrintOut(): void {
        this._router.navigate(['penjualan/print-out', this.GridSelectedData.id])
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }
}
