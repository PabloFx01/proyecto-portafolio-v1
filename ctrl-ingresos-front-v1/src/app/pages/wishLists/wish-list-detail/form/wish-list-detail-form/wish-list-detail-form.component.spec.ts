import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListDetailFormComponent } from './wish-list-detail-form.component';

describe('WishListDetailFormComponent', () => {
  let component: WishListDetailFormComponent;
  let fixture: ComponentFixture<WishListDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishListDetailFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WishListDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
