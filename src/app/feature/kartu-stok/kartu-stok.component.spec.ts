import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KartuStokComponent } from './kartu-stok.component';

describe('KartuStokComponent', () => {
  let component: KartuStokComponent;
  let fixture: ComponentFixture<KartuStokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KartuStokComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KartuStokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
