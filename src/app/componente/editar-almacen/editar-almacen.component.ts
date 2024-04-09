import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-almacen',
  templateUrl: './editar-almacen.component.html',
  styleUrls: ['./editar-almacen.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
})
export class EditarAlmacenComponent  implements OnInit {

  @Input() almacen: any;

  formularioAlmacen: FormGroup;

  constructor(
    private modalController:ModalController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formularioAlmacen = this.formBuilder.group({
      clave_almacen: [this.almacen.clave_almacen, Validators.required],
      localizacion_descripcion_almacen: [this.almacen.localizacion_descripcion_almacen, Validators.required],
      vigencia_calibracion_tanque: [this.almacen.vigencia_calibracion_tanque, Validators.required],
      capacidad_almacen: [this.almacen.capacidad_almacen, Validators.required],
      capacidad_operativa: [this.almacen.capacidad_operativa, Validators.required],
      capacidad_util: [this.almacen.capacidad_util, Validators.required],
      capacidad_fondaje: [this.almacen.capacidad_fondaje, Validators.required],
      volumen_minimo_operacion: [this.almacen.volumen_minimo_operacion, Validators.required],
      estado_tanque: [this.almacen.estado_tanque, Validators.required]
    });
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  guardarCambios() {
    this.modalController.dismiss(this.formularioAlmacen.value);
  }

}
