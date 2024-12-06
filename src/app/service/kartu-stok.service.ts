import { Injectable } from '@angular/core';
import { DbModel } from '../db/db.model';
import { db } from '../db/db';

@Injectable({
    providedIn: 'root'
})
export class KartuStokService {

    constructor() { }

    async getSisaStok(): Promise<[boolean, DbModel.StokBarang[]]> {
        try {
            const result: any[] = await db.saldoBarang.toArray();

            if (!result) {
                return [false, []]
            }

            return [true, result];

        } catch (error) {
            throw error;
        }
    }
}
