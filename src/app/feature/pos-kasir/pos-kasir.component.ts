import { AfterViewInit, Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardProdukComponent } from 'src/app/components/card-produk/card-produk.component';
import { BarangService } from 'src/app/service/barang.service';
import { BehaviorSubject, from, map } from 'rxjs';
import { DbModel } from 'src/app/db/db.model';
import { AvatarModule } from 'primeng/avatar';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetodeBayarService } from 'src/app/service/metode-bayar.service';
import { BankService } from 'src/app/service/bank.service';

@Component({
    selector: 'app-pos-kasir',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        InputTextModule,
        ButtonModule,
        CardProdukComponent,
        AvatarModule,
        InputNumberModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        DropdownModule
    ],
    templateUrl: './pos-kasir.component.html',
    styleUrls: ['./pos-kasir.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PosKasirComponent implements OnInit, AfterViewInit {

    Barang$ = new BehaviorSubject<DbModel.Barang[]>([]);

    Order: any[] = [];

    Form: FormGroup;

    FormPaymentMethod: FormGroup;

    DataPaymentMethod: any[] = [];

    ToggleModalPembayaran = false;

    @ViewChild('DialogPembayaran') DialogPembayaran!: Dialog;

    @ViewChild('PaymentMethod') PaymentMethod!: Dropdown;
    @ViewChild('Bank') Bank!: Dropdown;
    @ViewChild('DiskonPersen') DiskonPersen!: InputNumber;

    PaymentMethod$: any[] = [];

    Bank$ = from(this._bankService.getAll()).pipe(
        map((result) => {
            if (result[0]) {
                return result[1];
            } else {
                return [];
            }
        })
    );

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(args: KeyboardEvent) {
        if (args.key == 'F5') {
            args.preventDefault();
            if (!this.ToggleModalPembayaran) {
                this.handleOpenPaymentMethodDialog();
            }
        };

        if (args.key == 'F1') {
            args.preventDefault();
            if (this.ToggleModalPembayaran) {
                this.PaymentMethod.focus();
            }
        };

        if (args.key == 'F2') {
            args.preventDefault();
            if (this.ToggleModalPembayaran) {
                this.Bank.focus();
            }
        };

        if (args.key == 'F3') {
            args.preventDefault();
            if (this.ToggleModalPembayaran) {
                const diskon_persen = document.getElementById('diskon_persen')?.getElementsByClassName('p-inputnumber')[0].getElementsByClassName('p-inputnumber-input')[0] as HTMLInputElement;
                diskon_persen.focus();
            }
        };

        if (args.key == 'F4') {
            args.preventDefault();
            if (this.ToggleModalPembayaran) {
                const jumlah_bayar = document.getElementById('jumlah_bayar')?.getElementsByClassName('p-inputnumber')[0].getElementsByClassName('p-inputnumber-input')[0] as HTMLInputElement;
                jumlah_bayar.focus();
            }
        };
    }

    constructor(
        private _formBuilder: FormBuilder,
        private _bankService: BankService,
        private _barangService: BarangService,
        private _metodeBayarService: MetodeBayarService,

    ) {
        this.Form = this._formBuilder.group({
            tanggal_penjualan: [new Date(), [Validators.required]],
            no_faktur: ["", [Validators.required]],
            nama_customer: ["", [Validators.required]],
            jumlah_item: [0, [Validators.required]],
            grand_total: [0, [Validators.required]],
            ppn_persen: [0, [Validators.required]],
            ppn_rupiah: [0, [Validators.required]],
            biaya_lain: [0, [Validators.required]],
            total_transaksi: [0, [Validators.required]],
            keterangan: ["", [Validators.required]],
        });

        this.FormPaymentMethod = this._formBuilder.group({
            id_metode_bayar: [0, [Validators.required]],
            id_bank: [0, [Validators.required]],
            total: [0, [Validators.required]],
            diskon_persen: [0, [Validators.required]],
            diskon_rupiah: [0, [Validators.required]],
            total_payment_method: [0, [Validators.required]],
            jumlah_bayar: [0, [Validators.required]],
            kembalian: [0, [Validators.required]],
        });
    }

    ngOnInit(): void {
        if (localStorage.getItem("_BGPSORDER_")) {
            this.Order = JSON.parse(localStorage.getItem("_BGPSORDER_") as any);
            this.handleCountTotalOrder();
        }

        if (localStorage.getItem("_BGPSPAYMENT_")) {
            this.DataPaymentMethod = JSON.parse(localStorage.getItem("_BGPSPAYMENT_") as any);
        }

        this.getAllBarang();

        this.getAllPaymentMethod();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            (<HTMLInputElement>document.getElementById('scanBarcode')).focus();
        }, 1000);
    }

    getAllPaymentMethod(): void {
        from(this._metodeBayarService.getAll())
            .pipe(
                map((result) => {
                    if (result[0]) {
                        return result[1];
                    } else {
                        return [];
                    }
                })
            ).subscribe((result) => {
                this.PaymentMethod$ = result;
            })
    }

    getAllBarang(): void {
        this._barangService.getAll().then((result) => {
            if (result[0]) {
                this.Barang$.next(result[1]);
            }
        })
    }

    handleSearchProduk(payload: string): void {
        from(this._barangService.getAllByBarcodeOrNamaBarang(payload)).pipe(
            map((result) => {
                if (result[0]) {
                    if (result.length > 1) {
                        this.Barang$.next(result[1]);
                    }

                    return result[1];
                } else {
                    return [];
                }
            })
        ).subscribe((result) => {
            if (result.length) {
                if (result.length > 0 && result.length < 2) {
                    this.handleClickProduk(result[0]);
                    (<HTMLInputElement>document.getElementById('scanBarcode')).value = "";

                    this.getAllBarang();
                }
            }
        })
    }

    handleClickProduk(args: DbModel.Barang): void {
        const exist = this.Order.findIndex((item) => { return item.id == args.id });

        if (exist > -1) {
            this.Order[exist].qty += 1;
        } else {
            this.Order.push({ ...args, qty: 1 });
        }

        this.handleCountTotalOrder();
        this.handleStoreToLocalstorage();
    }

    handleEditQtyOrder(action: 'plus' | 'minus', index: number): void {
        if (action == 'plus') {
            this.Order[index].qty = this.Order[index].qty += 1;
        } else {
            if (this.Order[index].qty > 0) {
                this.Order[index].qty = this.Order[index].qty -= 1;
            };

            if (this.Order[index].qty < 1) {
                this.Order.splice(index, 1);
            };
        }

        setTimeout(() => {
            this.handleCountTotalOrder();
            this.handleStoreToLocalstorage();
        }, 200);
    }

    handleCountTotalOrder(): void {
        let jumlah_item = 0, grand_total = 0;

        for (const item of this.Order) {
            jumlah_item += item.qty;
            grand_total += (item.qty * item.harga_jual);
        };

        this.Form.get('jumlah_item')?.setValue(jumlah_item);
        this.Form.get('grand_total')?.setValue(grand_total);
    }

    // ** Payment Method Dialog method ===
    handleShowModalPembayaran(args: any): void {
        console.log(args);
    }

    handleOpenPaymentMethodDialog(): void {
        this.ToggleModalPembayaran = true;
        this.onInitPaymentMethod();

        this.DialogPembayaran.maximize();

        setTimeout(() => {
            const jumlah_bayar = document.getElementById('jumlah_bayar')?.getElementsByClassName('p-inputnumber')[0].getElementsByClassName('p-inputnumber-input')[0] as HTMLInputElement;
            jumlah_bayar.focus();
        }, 1000);
    }

    onInitPaymentMethod(): void {
        if (this.DataPaymentMethod.length) {

            let kurang_bayar = 0, terbayar = 0;

            this.DataPaymentMethod.forEach((item) => {
                terbayar += item.jumlah_bayar
            });

            kurang_bayar = (this.Form.get('grand_total')?.value - terbayar) < 0 ? 0 : this.Form.get('grand_total')?.value - terbayar;
            this.FormPaymentMethod.get('total')?.setValue(kurang_bayar);
            this.FormPaymentMethod.get('total_payment_method')?.setValue(kurang_bayar);

        } else {
            this.FormPaymentMethod.get('total')?.setValue(this.Form.get('grand_total')?.value);
            this.FormPaymentMethod.get('total_payment_method')?.setValue(this.Form.get('grand_total')?.value);
        }

        // console.log("CURRENT PAYMENT METHOD FORM =>", this.FormPaymentMethod.value);
    }

    onCountDiskonPayment(controls: string): void {
        const total = this.FormPaymentMethod.get('total')?.value;
        const value = this.FormPaymentMethod.get(controls)?.value;

        if (controls == 'diskon_persen') {
            this.FormPaymentMethod.get('diskon_rupiah')?.setValue(0);
            this.FormPaymentMethod.get('diskon_rupiah')?.setValue(total * (value / 100));
        } else {
            this.FormPaymentMethod.get('diskon_persen')?.setValue(0);
            this.FormPaymentMethod.get('diskon_persen')?.setValue(((value / total) * 100));
        }

        const total_payment_method = total - this.FormPaymentMethod.get('diskon_rupiah')?.value;
        this.FormPaymentMethod.get('total_payment_method')?.setValue(total_payment_method);
    }

    handleInputJumlahPembayaranDiterima(args: any): void {
        const total_payment_method = this.FormPaymentMethod.get('total_payment_method')?.value;

        if (args.value > total_payment_method) {
            this.FormPaymentMethod.get('kembalian')?.setValue(args.value - this.FormPaymentMethod.get('total_payment_method')?.value);
        } else {
            this.FormPaymentMethod.get('kembalian')?.setValue(0);
        }
    }

    getPaymentMethod(id: number): string {
        if (this.PaymentMethod$.length) {
            return this.PaymentMethod$.find((item) => { return item.id == id }).metode_bayar;
        } else {
            return "";
        }
    }

    handleAddNewPaymentMethod(data: any): void {
        const exist = this.DataPaymentMethod.findIndex((item) => { return item.id_metode_bayar == data.id_metode_bayar });

        if (exist > -1) {
            this.DataPaymentMethod[exist].jumlah_bayar += data.jumlah_bayar;
            this.DataPaymentMethod[exist].kembalian += data.kembalian;

            console.log(this.DataPaymentMethod);

        } else {
            this.DataPaymentMethod.push(data);
        }

        this.handleStoreToLocalstorage();
        this.onInitPaymentMethod();
        this.FormPaymentMethod.get('diskon_persen')?.setValue(0);
        this.FormPaymentMethod.get('diskon_rupiah')?.setValue(0);
        this.FormPaymentMethod.get('jumlah_bayar')?.setValue(0);
    }

    handleDeletePaymentMethod(index: number): void {
        this.DataPaymentMethod.splice(index, 1);
        this.handleStoreToLocalstorage();
        this.onInitPaymentMethod();
    }

    private handleStoreToLocalstorage(): void {
        localStorage.setItem("_BGPSORDER_", JSON.stringify(this.Order));
        localStorage.setItem('_BGPSPAYMENT_', JSON.stringify(this.DataPaymentMethod));
    }

    private handleDeleteLocalstorage(): void {
        localStorage.removeItem("_BGPSORDER_")
        localStorage.removeItem("_BGPSPAYMENT_")
    }
}
