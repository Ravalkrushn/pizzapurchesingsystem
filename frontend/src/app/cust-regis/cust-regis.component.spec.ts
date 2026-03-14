import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustRegisComponent } from './cust-regis.component';

describe('CustRegisComponent', () => {
  let component: CustRegisComponent;
  let fixture: ComponentFixture<CustRegisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustRegisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustRegisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
