import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaDetalleComponent } from './carta-detalle.component';

describe('CartaDetalleComponent', () => {
  let component: CartaDetalleComponent;
  let fixture: ComponentFixture<CartaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
