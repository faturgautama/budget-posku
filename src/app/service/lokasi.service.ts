import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { DbModel } from '../db/db.model';

@Injectable({
    providedIn: 'root'
})
export class LokasiService {

    constructor() { }

    async getAll(): Promise<[boolean, DbModel.Lokasi]> {
        try {
            const result: any[] = await db.lokasi.toArray();

            if (result) {
                return [true, result.length ? result[0] : {} as any]
            } else {
                return [false, {} as any]
            }

        } catch (error) {
            throw error;
        }
    }

    async insert(data: DbModel.Lokasi): Promise<[boolean, string]> {
        try {
            const result = await db.lokasi.add({
                nama_lokasi: data.nama_lokasi,
                alamat: data.alamat,
                kota: data.kota ? data.kota : "",
                no_handphone: data.no_handphone ? data.no_handphone : "",
                social_media: data.social_media ? data.social_media : "",
            });

            if (result) {
                return [true, "Data Berhasil Disimpan"]
            } else {
                return [false, "Data Gagal Disimapan"];
            }

        } catch (error) {
            throw error;
        }
    }

    async update(data: DbModel.Lokasi): Promise<[boolean, string]> {
        try {
            const result = await db.lokasi.put({
                id: data.id,
                nama_lokasi: data.nama_lokasi,
                alamat: data.alamat,
                kota: data.kota ? data.kota : "",
                no_handphone: data.no_handphone ? data.no_handphone : "",
                social_media: data.social_media ? data.social_media : "",
            });

            if (result) {
                return [true, "Data Berhasil Disimpan"]
            } else {
                return [false, "Data Gagal Disimapan"];
            }

        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<[boolean, string]> {
        try {
            const result: any = await db.lokasi.delete(id);

            if (result) {
                return [true, "Data Berhasil Disimpan"]
            } else {
                return [false, "Data Gagal Disimapan"];
            }

        } catch (error) {
            throw error;
        }
    }
}
