import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenjualanComponent } from './penjualan.component';

describe('PenjualanComponent', () => {
  let component: PenjualanComponent;
  let fixture: ComponentFixture<PenjualanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PenjualanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenjualanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
