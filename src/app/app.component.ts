import { Component, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from './db/db';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    title = 'budget-posku';

    lokasi$ = liveQuery(() => db.lokasi.toArray());

    saldoStok$ = liveQuery(() => db.saldoBarang.toArray());

    kartuStokBarang$ = liveQuery(() => db.kartuStok.toArray());

    // counter$ = liveQuery(() => db.counter.toArray());

    ngOnInit(): void {
        // console.log("db =>", db);

        this.lokasi$.subscribe((result) => {
            console.log("Lokasi =>", result[0]);
        });

        this.saldoStok$.subscribe((result) => {
            console.log("Saldo Stok =>", result);
        });

        this.kartuStokBarang$.subscribe((result) => {
            console.log("Kartu Stok =>", result);
        });

        // this.counter$.subscribe((result) => {
        //     console.log("Counter =>", result);
        // });
    }
}
