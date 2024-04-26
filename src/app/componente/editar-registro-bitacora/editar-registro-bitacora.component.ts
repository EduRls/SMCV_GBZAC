import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-editar-registro-bitacora',
  templateUrl: './editar-registro-bitacora.component.html',
  styleUrls: ['./editar-registro-bitacora.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class EditarRegistroBitacoraComponent  implements OnInit {

  @Input() registroBitacora: any;

  formularioBitacora: FormGroup;

  userToken:any;

  constructor(
    private formBuilder: FormBuilder,
    private modalController:ModalController,
    private toastController:ToastController,
    private storage:StorageService
  ) { }

  async ngOnInit() {
    await this.getInformacion();
    await this.generFormaulario();
  }

  async getInformacion(){
    this.userToken = await this.storage.getUserData();
  }

  async generFormaulario() {
    this.formularioBitacora = this.formBuilder.group({
      NumeroRegistro: [this.registroBitacora.NumeroRegistro, Validators.required],
      FechaYHoraEvento: [this.registroBitacora.FechaYHoraEvento, Validators.required],
      UsuarioResponsable: [this.registroBitacora.UsuarioResponsable, Validators.required],
      TipoEvento: [this.registroBitacora.TipoEvento, Validators.required],
      DescripcionEvento: [this.registroBitacora.DescripcionEvento, Validators.required],
      IdentificacionComponenteAlarma: [this.registroBitacora.IdentificacionComponenteAlarma, Validators.required]
    })
  }

  async cerrarModal(){
    this.modalController.dismiss();
  }

  async onSubmit(){
    if(this.formularioBitacora.valid) {
      this.modalController.dismiss(this.formularioBitacora.value);
    }else{
      this.presentToast('bottom', 'Favor de verificar los campos', 'warning');
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, color: "success" | "danger" | "warning") {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: position,
      color: color
    });

    await toast.present();
  }

}
