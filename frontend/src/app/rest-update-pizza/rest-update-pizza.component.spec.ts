import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestUpdatePizzaComponent } from './rest-update-pizza.component';

describe('RestUpdatePizzaComponent', () => {
  let component: RestUpdatePizzaComponent;
  let fixture: ComponentFixture<RestUpdatePizzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestUpdatePizzaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestUpdatePizzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
