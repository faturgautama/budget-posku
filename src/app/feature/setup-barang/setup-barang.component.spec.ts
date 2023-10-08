import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupBarangComponent } from './setup-barang.component';

describe('SetupBarangComponent', () => {
  let component: SetupBarangComponent;
  let fixture: ComponentFixture<SetupBarangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SetupBarangComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupBarangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
