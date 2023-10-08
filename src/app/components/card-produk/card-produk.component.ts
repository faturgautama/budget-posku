import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbModel } from 'src/app/db/db.model';

@Component({
    selector: 'app-card-produk',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './card-produk.component.html',
    styleUrls: ['./card-produk.component.scss']
})
export class CardProdukComponent {

    @Input('props') props!: DbModel.Barang;

    @Output('onClick') onClick = new EventEmitter<DbModel.Barang>();

    handleClick(args: DbModel.Barang) {
        this.onClick.emit(args);
    }
}
