import { Injectable } from '@angular/core';
import * as Excel from "exceljs";
import * as fs from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    private Workbook = new Excel.Workbook();

    constructor() { }

    exportToExcel(fileName: string, column: any, data: any) {
        let worksheets = this.Workbook.addWorksheet(fileName);

        worksheets.columns = column;

        for (const item of data) {
            worksheets.addRow(item);
        }

        let fileNames = `${fileName}-${new Date().getTime()}`;

        this.Workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, fileNames + '.xlsx');
        })
    }

    exportToCsv(payload: any) {
        const replacer = (key: any, value: any) => (value == null ? '' : value);
        const header = Object.keys(payload.dataSource[0]);
        const csv = payload.dataSource.map((row: any) =>
            header
                .map((fieldName) => JSON.stringify(row[fieldName], replacer))
                .join(',')
        );
        csv.unshift(header.join(','));
        const csvArray = csv.join('\r\n');

        const a = document.createElement('a');
        const blob = new Blob([csvArray], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = `${payload.worksheetName}-${new Date().getTime()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}
