import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import DataTable from 'datatables.net-dt';
import { EditarRegistroBitacoraComponent } from 'src/app/componente/editar-registro-bitacora/editar-registro-bitacora.component';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {

  formularioBitacora: FormGroup

  private userToken:any

  public infoBitactora:any;

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

    (await this.api.getBitacoraEvento(this.userToken.token, this.userToken.user.id_planta)).subscribe({
      next: (val:any) => {
        this.infoBitactora = val;
        this.generarTablaBitacora(this.infoBitactora);
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  async generarTablaBitacora(data: any) {
    setTimeout(() => { }, 300);
    let tablaUsuarios = new DataTable('#listaBitacora', {
      language: {
        url: "/assets/utils/es-ES.json"
      },
      columns: [
        { data: 'NumeroRegistro', title: 'Número de registro' },
        { data: 'FechaYHoraEvento', title: 'Fecha del evento' },
        { data: 'UsuarioResponsable', title: 'Usuario' },
        { data: 'TipoEvento', title: 'Tipo de evento' },
        { title: 'Operaciones', orderable: false, searchable: false, data: null }
      ],
      data: data,
      createdRow: (row: any, data: any, dataIndex: any) => {
        const editarButton = document.createElement('ion-button');
        editarButton.setAttribute('size', 'small');
        editarButton.innerHTML = '<ion-icon name="create"></ion-icon>';
        editarButton.addEventListener('click', () => this.abrirModalEditarBitacora(data));
        editarButton.style.marginRight = '15%';

        const eliminarButton = document.createElement('ion-button');
        eliminarButton.setAttribute('size', 'small');
        eliminarButton.setAttribute('color', 'danger');
        eliminarButton.innerHTML = '<ion-icon name="trash"></ion-icon>';
        eliminarButton.addEventListener('click', () => this.eliminarBitacora(data.id));

        const cell = row.getElementsByTagName('td')[4];
        cell.innerHTML = '';
        cell.appendChild(editarButton);
        cell.appendChild(eliminarButton);
      }
    });
    tablaUsuarios.draw();
  }

  async abrirModalEditarBitacora(dataBitacora:any){
    const editarRegistroBitacoraModal = await this.modal.create({
      component: EditarRegistroBitacoraComponent,
      componentProps: {
        registroBitacora: dataBitacora
      }
    });
    await editarRegistroBitacoraModal.present();

    const { data } = await editarRegistroBitacoraModal.onWillDismiss();

    if(data){
      (await this.api.editBitacoraEvento(dataBitacora.id, data, this.userToken.token)).subscribe({
        next: (val:any) => {
          this.presentToast('bottom', 'Se ha editado el registro', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }, error: (err) => {
          console.log(err)
        }
      })
    }


  }

  async eliminarBitacora(id:number){
    (await this.api.deleteBitacoraEvento(id, this.userToken.token)).subscribe({
      next: (val:any) => {
        this.presentToast('bottom', 'Se ha eliminado un registro', 'danger');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }, error: (err) => {
        this.presentToast('bottom', 'Algo ha salido mal', 'danger');
      }
    })
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
    if (this.formularioBitacora.valid) {
      (await this.api.createBitacoraEvento(this.formularioBitacora.value, this.userToken.token)).subscribe({
        next:(val)=>{
          this.presentToast('bottom', 'Se ha creado un nuevo registro','success');
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
