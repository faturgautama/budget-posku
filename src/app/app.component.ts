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

    bank$ = liveQuery(() => db.bank.toArray());

    ngOnInit(): void {
        this.lokasi$.subscribe((result) => {
            console.log(result[0]);
        });

        // this.bank$.subscribe((result) => {
        //     console.log(result);
        // });
    }
}
