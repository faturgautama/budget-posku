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
import { KartuStokService } from 'src/app/service/kartu-stok.service';

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
            { field: 'sisa_stok', headerName: 'SISA STOK', flex: 150, sortable: true, resizable: true },
        ],
        dataSource: [],
        height: "calc(100vh - 12rem)",
        showPaging: true,
        toolbar: []
    };

    constructor(
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _documentService: DocumentService,
        private _kartuStokService: KartuStokService,
    ) { }

    ngOnInit(): void {
        this.getData();
    }

    getData(): void {
        this._kartuStokService
            .getSaldoStokBarang()
            .then((result) => {
                if (result[0]) {
                    this.GridProps.dataSource = result[1];
                }
            })
    }

    onRowDoubleClicked(args: any): void {
        console.log("args =>", args);
    }

    onClickButtonAdd(): void {

    }
}

