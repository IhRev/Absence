import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceItemComponent } from './absence-item.component';

describe('AbsenceItemComponent', () => {
  let component: AbsenceItemComponent;
  let fixture: ComponentFixture<AbsenceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbsenceItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbsenceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
