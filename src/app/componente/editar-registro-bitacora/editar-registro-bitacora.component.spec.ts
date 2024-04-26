import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditarRegistroBitacoraComponent } from './editar-registro-bitacora.component';

describe('EditarRegistroBitacoraComponent', () => {
  let component: EditarRegistroBitacoraComponent;
  let fixture: ComponentFixture<EditarRegistroBitacoraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarRegistroBitacoraComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarRegistroBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
