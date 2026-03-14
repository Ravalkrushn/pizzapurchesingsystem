import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewCustomerComponent } from './admin-view-customer.component';

describe('AdminViewCustomerComponent', () => {
  let component: AdminViewCustomerComponent;
  let fixture: ComponentFixture<AdminViewCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminViewCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
