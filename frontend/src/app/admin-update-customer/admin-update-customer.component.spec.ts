import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateCustomerComponent } from './admin-update-customer.component';

describe('AdminUpdateCustomerComponent', () => {
  let component: AdminUpdateCustomerComponent;
  let fixture: ComponentFixture<AdminUpdateCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUpdateCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
