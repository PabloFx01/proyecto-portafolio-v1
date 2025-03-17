import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListDetailComponent } from './wish-list-detail.component';

describe('WishListDetailComponent', () => {
  let component: WishListDetailComponent;
  let fixture: ComponentFixture<WishListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishListDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WishListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
