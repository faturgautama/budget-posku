import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AppDB, db } from '../db/db';
import { importDB, exportDB } from "dexie-export-import";
import * as download from 'downloadjs';
import { LokasiService } from './lokasi.service';
import { formatDate } from '@angular/common';


@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    version: string = "0.1.0";

    constructor(
        private _lokasiService: LokasiService,
        private _messageService: MessageService
    ) { }

    checkValidator(form: FormGroup): any {
        let invalid: any[] = []

        this._messageService.clear();

        for (const item of Object.keys(form.controls)) {
            if (form.controls[item].invalid) {
                invalid.push(item);

                if (form.controls[item].errors?.['required']) {
                    this._messageService.add({ severity: 'error', summary: 'Oops', detail: `Kolom ${item} tidak boleh kosong` })
                } else {
                    this._messageService.add({ severity: 'error', summary: 'Oops', detail: `Periksa Kolom ${item}` })
                }
            }
        }

        return invalid.length > 0 ? false : true
    }

    async exportDatabase(): Promise<any> {
        try {
            const lokasi = await this._lokasiService.getAll();

            console.log("LOKASI =>", db.counter.toArray());

            const blob = await exportDB(db, { prettyJson: true });

            if (lokasi[0]) {
                download(blob, `db_${lokasi[1].nama_lokasi}_${formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'EN')}.json`, '"application/json"')
            } else {
                download(blob, `db_backup_${formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'EN')}.json`, '"application/json"')
            }

        } catch (error) {
            throw error;
        }
    }
}
