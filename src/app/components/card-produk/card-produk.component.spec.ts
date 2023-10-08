import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProdukComponent } from './card-produk.component';

describe('CardProdukComponent', () => {
  let component: CardProdukComponent;
  let fixture: ComponentFixture<CardProdukComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CardProdukComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProdukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
