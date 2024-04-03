import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-medidor',
  templateUrl: './editar-medidor.component.html',
  styleUrls: ['./editar-medidor.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditarMedidorComponent  implements OnInit {

  formularioEditarMedidorTurbina: FormGroup | any;
  @Input() medidor: any;

  constructor(
    private formBuilder:FormBuilder,
    private modalController:ModalController
  ) { }

  ngOnInit() {
    this.formularioEditarMedidorTurbina = this.formBuilder.group({
      modelo_equipo: [this.medidor[0].modelo_equipo, Validators.required],
      rango_flujo: [this.medidor[0].rango_flujo, Validators.required],
      rango_temperatura: [this.medidor[0].rango_temperatura, Validators.required],
      numero_serie: [this.medidor[0].numero_serie, Validators.required],
      precision: [this.medidor[0].precision, Validators.required],
      suministro_energia: [this.medidor[0].suministro_energia, Validators.required],
      salida_modelo: [this.medidor[0].salida_modelo, Validators.required],
      fecha: [this.medidor[0].fecha, Validators.required]
    });
  }

  cerrarModal(){

  }

  onSubmit() {
    this.modalController.dismiss(this.formularioEditarMedidorTurbina.value);
  }

}
