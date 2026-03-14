import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewRestaurantComponent } from './admin-view-restaurant.component';

describe('AdminViewRestaurantComponent', () => {
  let component: AdminViewRestaurantComponent;
  let fixture: ComponentFixture<AdminViewRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewRestaurantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminViewRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
