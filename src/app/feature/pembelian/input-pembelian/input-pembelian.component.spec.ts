import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPembelianComponent } from './input-pembelian.component';

describe('InputPembelianComponent', () => {
  let component: InputPembelianComponent;
  let fixture: ComponentFixture<InputPembelianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputPembelianComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputPembelianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
