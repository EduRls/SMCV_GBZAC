import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarEntradaSalidaPage } from './registrar-entrada-salida.page';

describe('RegistrarEntradaSalidaPage', () => {
  let component: RegistrarEntradaSalidaPage;
  let fixture: ComponentFixture<RegistrarEntradaSalidaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistrarEntradaSalidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
