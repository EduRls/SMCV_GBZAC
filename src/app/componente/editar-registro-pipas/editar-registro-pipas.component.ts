import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-registro-pipas',
  templateUrl: './editar-registro-pipas.component.html',
  styleUrls: ['./editar-registro-pipas.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class EditarRegistroPipasComponent  implements OnInit {

  @Input() registro: any; // Recibe el registro a editar como entrada

  formulario: FormGroup | any;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      inventario_inical: [this.registro.inventario_inical, Validators.required],
      compra: [this.registro.compra, Validators.required],
      venta: [this.registro.venta, Validators.required],
      inventario_final: [this.registro.inventario_final, Validators.required]
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.modalController.dismiss(this.formulario.value)
    } else {
      console.log('El formulario no es válido');
    }
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
