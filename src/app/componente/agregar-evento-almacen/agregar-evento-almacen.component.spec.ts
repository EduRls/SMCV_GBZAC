import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgregarEventoAlmacenComponent } from './agregar-evento-almacen.component';

describe('AgregarEventoAlmacenComponent', () => {
  let component: AgregarEventoAlmacenComponent;
  let fixture: ComponentFixture<AgregarEventoAlmacenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarEventoAlmacenComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarEventoAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
