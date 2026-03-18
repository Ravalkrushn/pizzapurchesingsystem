import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestNewOrderViewComponent } from './rest-new-order-view.component';

describe('RestNewOrderViewComponent', () => {
  let component: RestNewOrderViewComponent;
  let fixture: ComponentFixture<RestNewOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestNewOrderViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestNewOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
