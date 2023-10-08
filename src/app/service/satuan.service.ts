import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { DbModel } from '../db/db.model';

@Injectable({
    providedIn: 'root'
})
export class SatuanService {

    constructor() { }

    async getAll(): Promise<[boolean, DbModel.Satuan[]]> {
        try {
            const result: any[] = await db.satuan.toArray();

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async insert(data: DbModel.Satuan): Promise<[boolean, string]> {
        try {
            const result = await db.satuan.add({
                nama_satuan: data.nama_satuan,
                isi: data.isi,
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

    async update(data: DbModel.Satuan): Promise<[boolean, string]> {
        try {
            const result = await db.satuan.put({
                id: data.id,
                nama_satuan: data.nama_satuan,
                isi: data.isi,
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
            const result: any = await db.satuan.delete(id);

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
