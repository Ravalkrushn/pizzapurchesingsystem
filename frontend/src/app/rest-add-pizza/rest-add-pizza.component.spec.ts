import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestAddPizzaComponent } from './rest-add-pizza.component';

describe('RestAddPizzaComponent', () => {
  let component: RestAddPizzaComponent;
  let fixture: ComponentFixture<RestAddPizzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestAddPizzaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestAddPizzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
