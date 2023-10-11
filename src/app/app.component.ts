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

    // counter$ = liveQuery(() => db.counter.toArray());

    ngOnInit(): void {
        this.lokasi$.subscribe((result) => {
            console.log("Lokasi =>", result[0]);
        });

        // this.counter$.subscribe((result) => {
        //     console.log("Counter =>", result);
        // });
    }
}
