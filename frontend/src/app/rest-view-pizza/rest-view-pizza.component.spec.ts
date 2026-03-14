import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestViewPizzaComponent } from './rest-view-pizza.component';

describe('RestViewPizzaComponent', () => {
  let component: RestViewPizzaComponent;
  let fixture: ComponentFixture<RestViewPizzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestViewPizzaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestViewPizzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
