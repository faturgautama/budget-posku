import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { DbModel } from '../db/db.model';

@Injectable({
    providedIn: 'root'
})
export class BankService {

    constructor() { }

    async getAll(): Promise<[boolean, DbModel.Bank[]]> {
        try {
            const result: any[] = await db.bank.toArray();

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async insert(data: DbModel.Bank): Promise<[boolean, string]> {
        try {
            const result = await db.bank.add({
                bank: data.bank,
            });

            if (result) {
                return [true, "Data Berhasil Disimpan"]
            } else {
                return [false, "Data Gagal Disimpan"];
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(data: DbModel.Bank): Promise<[boolean, string]> {
        try {
            const result = await db.bank.put({
                id: data.id,
                bank: data.bank,
            });

            if (result) {
                return [true, "Data Berhasil Diperbarui"]
            } else {
                return [false, "Data Gagal Diperbarui"];
            }

        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<[boolean, string]> {
        try {
            const result: any = await db.bank.delete(id);

            if (result) {
                return [true, "Data Berhasil Dihapus"]
            } else {
                return [false, "Data Gagal Dihapus"];
            }

        } catch (error) {
            throw error;
        }
    }
}
