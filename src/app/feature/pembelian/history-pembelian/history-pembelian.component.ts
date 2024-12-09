import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { PembelianService } from 'src/app/service/pembelian.service';
import { Router } from '@angular/router';

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
            { field: 'no_faktur', headerName: 'NO. FAKTUR', flex: 150, sortable: true, resizable: true },
            { field: 'tanggal_pembelian', headerName: 'TGL. PEMBELIAN', flex: 150, sortable: true, resizable: true },
            { field: 'nama_supplier', headerName: 'NAMA SUPPLIER', flex: 150, sortable: true, resizable: true },
            { field: 'jumlah_item', headerName: 'JUMLAH ITEM', flex: 150, sortable: true, resizable: true },
            { field: 'grand_total', headerName: 'GRAND TOTAL', flex: 150, sortable: true, resizable: true },
        ],
        dataSource: [],
        height: "calc(100vh - 12rem)",
        showPaging: true,
        toolbar: []
    };

    constructor(
        private _router: Router,
        private _documentService: DocumentService,
        private _pembelianService: PembelianService,
    ) { }

    ngOnInit(): void {
        this.getData();
    }

    getData(): void {
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

    onClickButtonAdd(): void {
        this._router.navigateByUrl('pembelian/input');
    }
}
