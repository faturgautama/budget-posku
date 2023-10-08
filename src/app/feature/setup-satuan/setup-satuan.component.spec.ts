import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupSatuanComponent } from './setup-satuan.component';

describe('SetupSatuanComponent', () => {
  let component: SetupSatuanComponent;
  let fixture: ComponentFixture<SetupSatuanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SetupSatuanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupSatuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
