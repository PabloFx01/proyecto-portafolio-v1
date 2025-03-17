import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoFormComponent } from './concepto-form.component';

describe('ConceptoFormComponent', () => {
  let component: ConceptoFormComponent;
  let fixture: ComponentFixture<ConceptoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConceptoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConceptoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
