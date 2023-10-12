import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { GridComponent, GridModel } from 'src/app/components/grid/grid.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { MessageService } from 'primeng/api';
import { UtilityService } from 'src/app/service/utility.service';
import { MetodeBayarService } from 'src/app/service/metode-bayar.service';
import { DocumentService } from 'src/app/service/document.service';

@Component({
    selector: 'app-setup-metode-bayar',
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
    templateUrl: './setup-metode-bayar.component.html',
    styleUrls: ['./setup-metode-bayar.component.scss']
})
export class SetupMetodeBayarComponent implements OnInit {

    Form: FormGroup;

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
                        header: 'METODE BAYAR',
                        key: 'metode_bayar',
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
            { field: 'metode_bayar', headerName: 'METODE BAYAR', flex: 150, sortable: true, resizable: true }
        ],
        dataSource: [],
        height: "calc(100vh - 12rem)",
        showPaging: true,
        toolbar: []
    };

    constructor(
        private _formBuilder: FormBuilder,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _documentService: DocumentService,
        private _metodeBayarService: MetodeBayarService,
    ) {
        this.Form = this._formBuilder.group({
            id: [0, []],
            metode_bayar: ['', [Validators.required]],
        })
    }

    ngOnInit(): void {
        this.getData();
    }

    getData(): void {
        this._metodeBayarService.getAll()
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
        this.Form.get('metode_bayar')?.setValue(args.metode_bayar);
    }

    onClickButtonAdd(): void {
        this.FormState = 'new';
        this.Form.reset();
    }

    handleSave(): void {
        if (this._utilityService.checkValidator(this.Form)) {
            this._metodeBayarService.insert(this.Form.value)
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
        this._metodeBayarService.update(this.Form.value)
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
