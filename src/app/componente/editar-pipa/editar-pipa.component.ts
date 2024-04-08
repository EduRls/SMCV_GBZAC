import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-pipa',
  templateUrl: './editar-pipa.component.html',
  styleUrls: ['./editar-pipa.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
})
export class EditarPipaComponent implements OnInit {

  @Input() pipa: any;
  formularioPipa: FormGroup | any;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formularioPipa = this.formBuilder.group({
      clave_pipa: [this.pipa.clave_pipa, Validators.required],
      responsable_pipa: [this.pipa.responsable_pipa, Validators.required],
      capacidad_pipa: [this.pipa.capacidad_pipa, Validators.required],
      localizacion_descripcion_pipa: [this.pipa.localizacion_descripcion_pipa, Validators.required],
      vigencia_calibracion_tanque: [this.pipa.vigencia_calibracion_tanque, Validators.required],
      capacidad_operativa: [this.pipa.capacidad_operativa, Validators.required],
      capacidad_util: [this.pipa.capacidad_util, Validators.required],
      capacidad_fondaje: [this.pipa.capacidad_fondaje, Validators.required],
      volumen_minimo_operacion: [this.pipa.volumen_minimo_operacion, Validators.required],
      estado_tanque: [this.pipa.estado_tanque, Validators.required]
    });
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  guardarCambios() {
    this.modalController.dismiss(this.formularioPipa.value);
  }
}
