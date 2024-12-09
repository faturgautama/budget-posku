import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPembelianComponent } from './history-pembelian.component';

describe('HistoryPembelianComponent', () => {
  let component: HistoryPembelianComponent;
  let fixture: ComponentFixture<HistoryPembelianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HistoryPembelianComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryPembelianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
