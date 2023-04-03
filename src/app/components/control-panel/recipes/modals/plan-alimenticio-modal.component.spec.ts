import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAlimenticioModalComponent } from './plan-alimenticio-modal.component';

describe('PlanAlimenticioModalComponent', () => {
  let component: PlanAlimenticioModalComponent;
  let fixture: ComponentFixture<PlanAlimenticioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanAlimenticioModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAlimenticioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
