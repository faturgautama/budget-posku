import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { DbModel } from '../db/db.model';
import { formatDate } from '@angular/common';

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
                            nama_satuan: nama_satuan,
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

    async getById(id_barang: number): Promise<[boolean, DbModel.Barang]> {
        try {
            const satuan = await db.satuan.toArray();

            const barang = await db.barang.get({ id: id_barang })

            let result = {
                ...barang,
                nama_satuan: satuan.find((sat) => { return sat.id == barang?.id_satuan })?.nama_satuan
            };

            if (result) {
                return [true, result as any]
            } else {
                return [false, null as any]
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
                brand: data.brand ? data.brand : "",
                ukuran: data.ukuran ? data.ukuran : "",
                jumlah_stok: data.jumlah_stok ? data.jumlah_stok : 0,
                harga_beli_terakhir: 0,
                created_at: formatDate(new Date(), 'yyyy-MM-dd', 'EN'),
                image: data.image ? data.image : null,
                is_active: true,
            });

            if (!result) {
                return [false, "Data Gagal Disimpan"];
            };

            const initKartuStok = await db.saldoBarang.add({
                id_barang: result,
                sisa_stok: 0,
            });

            if (!initKartuStok) {
                return [false, "Saldo Stok Gagal Disimpan"];
            };

            return [true, "Data Berhasil Disimpan"]

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
                brand: data.brand ? data.brand : "",
                ukuran: data.ukuran ? data.ukuran : "",
                jumlah_stok: data.jumlah_stok ? data.jumlah_stok : 0,
                harga_beli_terakhir: data.harga_beli_terakhir ? data.harga_beli_terakhir : 0,
                created_at: data.created_at,
                image: data.image ? data.image : null,
                is_active: data.is_active,
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

    async updateStok(id_barang: number, qty: number): Promise<[boolean, string]> {
        try {
            const barang = await db.barang.get(id_barang);

            if (barang) {
                const result = await db.barang.put({
                    id: barang?.id,
                    id_satuan: barang.id_satuan,
                    nama_barang: barang.nama_barang,
                    barcode: barang.barcode,
                    harga_jual: barang.harga_jual,
                    jumlah_stok: barang?.jumlah_stok! - qty,
                    brand: barang.brand ? barang.brand : "",
                    ukuran: barang.ukuran ? barang.ukuran : "",
                    created_at: barang.created_at,
                    image: barang.image ? barang.image : null,
                    is_active: barang.is_active,
                });

                if (result) {
                    return [true, "Data Berhasil Diperbarui"]
                } else {
                    return [false, "Data Gagal Diperbarui"];
                }
            } else {
                return [false, "Data Gagal Diperbarui"];
            }

        } catch (error) {
            throw error;
        }
    }

    async updateHargaBeliTerakhir(id_barang: number, harga_beli_terakhir: number): Promise<[boolean, string]> {
        try {
            const barang = await db.barang.get(id_barang);

            if (barang) {
                const result = await db.barang.put({
                    id: barang?.id,
                    id_satuan: barang.id_satuan,
                    nama_barang: barang.nama_barang,
                    barcode: barang.barcode,
                    harga_jual: barang.harga_jual,
                    jumlah_stok: barang?.jumlah_stok,
                    harga_beli_terakhir: harga_beli_terakhir,
                    brand: barang.brand ? barang.brand : "",
                    ukuran: barang.ukuran ? barang.ukuran : "",
                    created_at: barang.created_at,
                    image: barang.image ? barang.image : null,
                    is_active: barang.is_active,
                });

                if (result) {
                    return [true, "Data Berhasil Diperbarui"]
                } else {
                    return [false, "Data Gagal Diperbarui"];
                }
            } else {
                return [false, "Data Gagal Diperbarui"];
            }

        } catch (error) {
            throw error;
        }
    }

    async syncHargaBeliTerakhir(): Promise<[boolean, string]> {
        try {
            const barang = await db.barang.toArray();

            if (barang) {
                for (const item of barang) {
                    const latestPembelianDetail = await db.pembelianDetail
                        .where('id_barang')
                        .equals(item.id!)
                        .sortBy('id_pembelian');

                    const result = await db.barang.put({
                        id: item.id,
                        id_satuan: item.id_satuan,
                        nama_barang: item.nama_barang,
                        barcode: item.barcode,
                        harga_jual: item.harga_jual,
                        brand: item.brand ? item.brand : "",
                        ukuran: item.ukuran ? item.ukuran : "",
                        jumlah_stok: item.jumlah_stok ? item.jumlah_stok : 0,
                        harga_beli_terakhir: latestPembelianDetail.length ? latestPembelianDetail[latestPembelianDetail.length - 1].harga_beli : (item.harga_beli_terakhir ? item.harga_beli_terakhir : 0),
                        created_at: item.created_at,
                        image: item.image ? item.image : null,
                        is_active: item.is_active,
                    });

                    if (!result) {
                        return [false, "Data Gagal Diperbarui"];
                    }
                }

                return [true, "Data Berhasil Diperbarui"]

            } else {
                return [false, "Data Gagal Diperbarui"];
            }

        } catch (error) {
            throw error;
        }
    }
}
