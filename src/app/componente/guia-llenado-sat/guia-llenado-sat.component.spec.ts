import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuiaLlenadoSatComponent } from './guia-llenado-sat.component';

describe('GuiaLlenadoSatComponent', () => {
  let component: GuiaLlenadoSatComponent;
  let fixture: ComponentFixture<GuiaLlenadoSatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuiaLlenadoSatComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuiaLlenadoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
