import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupMetodeBayarComponent } from './setup-metode-bayar.component';

describe('SetupMetodeBayarComponent', () => {
  let component: SetupMetodeBayarComponent;
  let fixture: ComponentFixture<SetupMetodeBayarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SetupMetodeBayarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupMetodeBayarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
