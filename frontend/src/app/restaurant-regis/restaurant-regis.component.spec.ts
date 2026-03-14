import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantRegisComponent } from './restaurant-regis.component';

describe('RestaurantRegisComponent', () => {
  let component: RestaurantRegisComponent;
  let fixture: ComponentFixture<RestaurantRegisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantRegisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestaurantRegisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
