import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, formatCurrency, formatDate } from '@angular/common';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';
import { UtilityService } from 'src/app/service/utility.service';
import { PenjualanService } from 'src/app/service/penjualan.service';
import { ReplaySubject, from, takeUntil, map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-penjualan',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        GridComponent,
        ButtonModule,
        MenuModule,
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

    GridDetailProps: GridModel.IGrid = {
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

    Penjualan$: any[] = []

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

    constructor(
        private _utilityService: UtilityService,
        private _penjualanService: PenjualanService,
    ) { }

    ngOnInit(): void {
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

        from(this._penjualanService.getDetailPenjualan(2)).pipe(
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
            // this.GridProps.dataSource = result;
        })
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }
}
