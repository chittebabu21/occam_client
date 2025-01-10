import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorFormComponent } from './exhibitor-form.component';

describe('ExhibitorFormComponent', () => {
  let component: ExhibitorFormComponent;
  let fixture: ComponentFixture<ExhibitorFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExhibitorFormComponent]
    });
    fixture = TestBed.createComponent(ExhibitorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
