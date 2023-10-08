import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupLokasiComponent } from './setup-lokasi.component';

describe('SetupLokasiComponent', () => {
  let component: SetupLokasiComponent;
  let fixture: ComponentFixture<SetupLokasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SetupLokasiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupLokasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
