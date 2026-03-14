import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustSelectRestComponent } from './cust-select-rest.component';

describe('CustSelectRestComponent', () => {
  let component: CustSelectRestComponent;
  let fixture: ComponentFixture<CustSelectRestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustSelectRestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustSelectRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
