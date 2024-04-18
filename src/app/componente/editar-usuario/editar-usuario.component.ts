import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule]
})
export class EditarUsuarioComponent  implements OnInit {

  formularioEditarUsuario: FormGroup;

  @Input()usuario: any;
  @Input()rolesUsuario: any;

  constructor(
    private modalController:ModalController,
    private formBuilder:FormBuilder,
    private toastController:ToastController
  ) { }

  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, color: "success" | "danger" | "warning") {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: position,
      color: color
    });

    await toast.present();
  }

  ngOnInit() {
    this.formularioEditarUsuario = this.formBuilder.group({
      name: [this.usuario[0].name, Validators.required],
      id_rol_usuario: [this.usuario[0].id_rol_usuario, Validators.required],
      email: [this.usuario[0].email, Validators.required],
      password: ['']
    });
  }

  cerrarModal(){
    this.modalController.dismiss();
  }

  onSubmit() {
    if(this.formularioEditarUsuario.valid){
      this.modalController.dismiss(this.formularioEditarUsuario.value);
    }else{
      this.presentToast('bottom', 'Favor de verificar los campos', 'warning');
    }
  }

}
