import { Injectable } from '@angular/core';
import { DbModel } from '../db/db.model';
import { db } from '../db/db';

@Injectable({
    providedIn: 'root'
})
export class MetodeBayarService {

    constructor() { }

    async getAll(): Promise<[boolean, DbModel.MetodeBayar[]]> {
        try {
            const result: any[] = await db.metodeBayar.toArray();

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async insert(data: DbModel.MetodeBayar): Promise<[boolean, string]> {
        try {
            const result = await db.metodeBayar.add({
                metode_bayar: data.metode_bayar,
            });

            if (result) {
                return [true, "Data Berhasil Disimpan"]
            } else {
                return [false, "Data Gagal Disimpan"];
            }

        } catch (error) {
            throw error;
        }
    }

    async update(data: DbModel.MetodeBayar): Promise<[boolean, string]> {
        try {
            const result = await db.metodeBayar.put({
                id: data.id,
                metode_bayar: data.metode_bayar,
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
            const result: any = await db.metodeBayar.delete(id);

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
