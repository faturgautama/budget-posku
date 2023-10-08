import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { DbModel } from '../db/db.model';

@Injectable({
    providedIn: 'root'
})
export class BarangService {

    constructor() { }

    async getAll(): Promise<[boolean, DbModel.Barang[]]> {
        try {
            const satuan = await db.satuan.toArray();

            const result: any[] = await db.barang.toArray()
                .then((barangs) => {
                    return barangs.map((item) => {
                        const nama_satuan = satuan.find((sat) => { return sat.id == item.id_satuan })?.nama_satuan;

                        const payload = {
                            ...item,
                            nama_satuan: nama_satuan
                        };

                        return payload;
                    });
                })

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async getAllByBarcodeOrNamaBarang(payload: string): Promise<[boolean, DbModel.Barang[]]> {
        try {
            let result: any[] = [];

            const resultSearchUsingBarcode: any[] = await db.barang
                .where('barcode')
                .equals(payload)
                .toArray();

            if (resultSearchUsingBarcode.length) {
                result = resultSearchUsingBarcode;
            } else {
                const resultSearchUsingNamaBarang: any[] = await db.barang
                    .where('nama_barang')
                    .startsWithIgnoreCase(payload)
                    .toArray();

                if (resultSearchUsingNamaBarang.length) {
                    result = resultSearchUsingNamaBarang;
                } else {
                    const resultGetAll = await this.getAll();

                    if (resultGetAll[0]) {
                        result = resultGetAll[1];
                    } else {
                        result = [];
                    }
                }
            }

            if (result) {
                const satuan = await db.satuan.toArray();

                const barang = result.map((item) => {
                    const nama_satuan = satuan.find((sat) => { return sat.id == item.id_satuan })?.nama_satuan;

                    const payload = {
                        ...item,
                        nama_satuan: nama_satuan
                    };

                    return payload;
                });

                return [true, barang]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async insert(data: DbModel.Barang): Promise<[boolean, string]> {
        try {
            const result = await db.barang.add({
                id_satuan: data.id_satuan,
                nama_barang: data.nama_barang,
                barcode: data.barcode,
                harga_jual: data.harga_jual,
                jumlah_stok: data.jumlah_stok ? data.jumlah_stok : 0,
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

    async update(data: DbModel.Barang): Promise<[boolean, string]> {
        try {
            const result = await db.barang.put({
                id: data.id,
                id_satuan: data.id_satuan,
                nama_barang: data.nama_barang,
                barcode: data.barcode,
                harga_jual: data.harga_jual,
                jumlah_stok: data.jumlah_stok ? data.jumlah_stok : 0,
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
            const result: any = await db.barang.delete(id);

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
