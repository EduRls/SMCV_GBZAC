import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mantenimiento-turbina',
  templateUrl: './mantenimiento-turbina.component.html',
  styleUrls: ['./mantenimiento-turbina.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule]
})
export class MantenimientoTurbinaComponent  implements OnInit {

  @Input() mTurbina: any;

  formularioMantenimiento: FormGroup;

  constructor(
    private modalController:ModalController,
    private formBuilder:FormBuilder,
    private toastController:ToastController
  ) { }

  ngOnInit() {
    this.formularioMantenimiento = this.formBuilder.group({
      id_medidor : [this.mTurbina[0].id, Validators.required],
      id_planta : [this.mTurbina[0].id_planta, Validators.required],
      tipo_mantenimiento: ['', Validators.required],
      responsable: ['', Validators.required],
      estado: ['', Validators.required],
      observaciones: ['', Validators.required],
    });
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color: "success" | "warning" | "danger") {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
      color: color
    });

    await toast.present();
  }

  guardarCambios() {
    if(this.formularioMantenimiento.valid){
      this.modalController.dismiss(this.formularioMantenimiento.value);
    }else{
      this.presentToast('bottom', 'Favor de completar los campos', 'warning');
    }
  }

  cerrarModal(){
    this.modalController.dismiss();
  }

}
