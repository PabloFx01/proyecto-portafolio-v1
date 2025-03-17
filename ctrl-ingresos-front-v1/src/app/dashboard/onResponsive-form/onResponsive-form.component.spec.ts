import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnUserFormComponent } from './onResponsive-form.component';

describe('OnUserFormComponent', () => {
  let component: OnUserFormComponent;
  let fixture: ComponentFixture<OnUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnUserFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
