import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsigTotalFormComponent } from './asig-total-form.component';

describe('AsigTotalFormComponent', () => {
  let component: AsigTotalFormComponent;
  let fixture: ComponentFixture<AsigTotalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsigTotalFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsigTotalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
