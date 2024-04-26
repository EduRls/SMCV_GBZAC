import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {

  formularioBitacora: FormGroup

  private userToken:any

  constructor(
    private modal:ModalController,
    private formBuilder:FormBuilder,
    private toastController:ToastController,
    private api:LaravelService,
    private storage:StorageService
  ) { }

  async ngOnInit() {
    await this.getInformacion();
    await this.generFormaulario();
  }

  async getInformacion(){
    this.userToken = this.storage.getUserData();
  }

  async generFormaulario(){
    this.formularioBitacora = this.formBuilder.group({
      id_planta: [this.userToken.user.id_planta, Validators.required],
      NumeroRegistro: [],
      FechaYHoraEvento: [],
      UsuarioResponsable: [],
      TipoEvento: [],
      DescripcionEvento: [],
      IdentificacionComponenteAlarma: []
    })
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

  async onSubmit() {
    console.log(this.formularioBitacora.value)
    if (this.formularioBitacora.valid) {
      (await this.api.createUsuario(this.formularioBitacora.value, this.userToken.token)).subscribe({
        next:(val)=>{
          this.presentToast('bottom', 'Se ha creado un nvueo usuario','success');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }, error:(err)=>{
          this.presentToast('bottom', 'Algo ha salido mal', 'danger');
        }
      })
    }else{
      this.presentToast('bottom', 'Favor de verificar los campos', 'warning');
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
