import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOutStrukComponent } from './print-out-struk.component';

describe('PrintOutStrukComponent', () => {
  let component: PrintOutStrukComponent;
  let fixture: ComponentFixture<PrintOutStrukComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PrintOutStrukComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintOutStrukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
