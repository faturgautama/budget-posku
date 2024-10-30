import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LokasiService } from 'src/app/service/lokasi.service';
import { PenjualanService } from 'src/app/service/penjualan.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-print-out-struk',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './print-out-struk.component.html',
    styleUrls: ['./print-out-struk.component.scss']
})
export class PrintOutStrukComponent implements AfterViewInit, OnDestroy {

    Destroy$ = new Subject();

    Lokasi: any;

    Penjualan: any;

    Loading = new BehaviorSubject(true);

    @HostListener('window:afterprint', ['$event'])
    onAfterPrint(event: Event) {
        window.history.back();
    }

    constructor(
        private _lokasiService: LokasiService,
        private _activatedRoute: ActivatedRoute,
        private _penjualanService: PenjualanService
    ) {
        this.Loading
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (!result) {
                    setTimeout(() => {
                        window.print();
                    }, 200);
                }
            })
    }

    ngAfterViewInit(): void {
        // this.Loading.next(true);

        setTimeout(() => {
            this.getLokasi();
            this.getDetail();
        }, 250);
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    getLokasi(): void {
        this._lokasiService.getAll()
            .then((result) => {
                if (result[0]) {
                    this.Lokasi = result[1];
                }
            })
    }

    getDetail(): void {
        const id = this._activatedRoute.snapshot.params['id'];

        this._penjualanService.getDetail(id)
            .then((result) => {
                if (result[0]) {
                    this.Penjualan = result[1];
                }
            }).finally(() => {
                this.Loading.next(false)
            })
    }
}
