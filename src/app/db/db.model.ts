export namespace DbModel {
    export interface Lokasi {
        id?: number;
        nama_lokasi: string;
        alamat: string;
        kota?: string;
        no_handphone?: string;
        social_media?: string;
    }

    export interface Satuan {
        id?: number;
        nama_satuan: string;
        isi: number;
    }

    export interface Barang {
        id?: number;
        nama_barang: string;
        barcode: string;
        id_satuan: number;
        nama_satuan?: string;
        brand?: string;
        ukuran?: string;
        harga_jual: string;
        jumlah_stok?: number;
    }

    export interface MetodeBayar {
        id?: number;
        metode_bayar: string;
    }

    export interface Bank {
        id?: number;
        bank: string;
    }

    export interface Pembelian {
        id?: number;
        tanggal_pembelian: string;
        no_faktur?: string;
        nama_supplier?: string;
        jumlah_item?: number;
        grand_total: number;
        keterangan?: string;
    }

    export interface PembelianDetail {
        id?: number;
        id_pembelian: number;
        id_barang: number;
        harga_beli: number;
        qty: string;
        total: number;
    }

    export interface Penjualan {
        id?: number;
        tanggal_penjualan: string;
        no_faktur?: string;
        nama_customer?: string;
        jumlah_item: number;
        grand_total: number;
        ppn_persen?: number;
        ppn_rupiah?: number;
        biaya_lain?: number;
        total_transaksi: number;
        keterangan?: string;
    }

    export interface PenjualanDetail {
        id?: number;
        id_penjualan: number;
        id_barang: number;
        harga_jual: number;
        qty: string;
        total: number;
    }

    export interface PenjualanDetailPayment {
        id?: number;
        id_penjualan: number;
        id_metode_bayar: number;
        id_bank?: number;
        total: number;
        diskon_persen: number;
        diskon_rupiah: number;
        total_payment_method: number;
        jumlah_bayar: number;
        kembalian: number;
    }

    export interface KartuStok {
        id?: number;
        ref_id?: number;
        id_barang: number;
        saldo_awal?: number;
        nilai_masuk?: number;
        nilai_keluar?: number;
        saldo_akhir?: number;
        keterangan?: string;
        created_at: string;
    }

    export interface StokBarang {
        id?: number;
        id_barang: number;
        sisa_stok: number;
    }

    export interface Counter {
        id?: number;
        prefix: string;
        counter: number;
    }
}