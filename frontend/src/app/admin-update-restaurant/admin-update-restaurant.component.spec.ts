import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateRestaurantComponent } from './admin-update-restaurant.component';

describe('AdminUpdateRestaurantComponent', () => {
  let component: AdminUpdateRestaurantComponent;
  let fixture: ComponentFixture<AdminUpdateRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateRestaurantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUpdateRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
