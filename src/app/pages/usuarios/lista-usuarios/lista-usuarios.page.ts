import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataTable from 'datatables.net-dt';
import { EditarUsuarioComponent } from 'src/app/componente/editar-usuario/editar-usuario.component';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {

  public formularioUsuario: FormGroup;

  public rolesUsuario: any;
  public usuariosLista: any;

  private userToken: any;

  constructor(
    private storage: StorageService,
    private api: LaravelService,
    private toastController: ToastController,
    private modal: ModalController,
    private formBuilder: FormBuilder,
    private authService:AuthService
  ) { }

  async ngOnInit() {
    await this.getInformacion();
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

  async getInformacion() {
    this.userToken = this.storage.getUserData();
    (await this.api.getRolUsuario(this.userToken.token)).subscribe({
      next: (val) => {
        this.rolesUsuario = val;
      }, error: (error) => {
        console.log(error)
      }
    });
    (await this.api.getUsuarios(this.userToken.token, this.userToken.user.id_planta)).subscribe({
      next: (val) => {
        this.usuariosLista = val;
        this.generarTablaUsuarios(this.usuariosLista);
      }, error: (error) => {
        console.log(error);
      }
    });
    await this.generarFormulario();
  }

  async generarFormulario() {
    this.formularioUsuario = this.formBuilder.group({
      name: ['', Validators.required],
      id_planta: [this.userToken.user.id_planta, Validators.required],
      id_rol_usuario: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async generarTablaUsuarios(data: any) {
    setTimeout(() => { }, 300);
    let tablaUsuarios = new DataTable('#listaUsuarios', {
      language: {
        url: "/assets/utils/es-ES.json"
      },
      columns: [
        { data: 'name', title: 'Nombre de usuario' },
        { data: 'planta.nombre_planta', title: 'Nombre de planta' },
        { data: 'rol.rol', title: 'Rol de usuario' },
        { title: 'Operaciones', orderable: false, searchable: false, data: null }
      ],
      data: data,
      createdRow: (row: any, data: any, dataIndex: any) => {
        const editarButton = document.createElement('ion-button');
        editarButton.setAttribute('size', 'small');
        editarButton.innerHTML = '<ion-icon name="create"></ion-icon>';
        editarButton.addEventListener('click', () => this.abrirModalEditarUsuario(data.id));
        editarButton.style.marginRight = '15%';

        const eliminarButton = document.createElement('ion-button');
        eliminarButton.setAttribute('size', 'small');
        eliminarButton.setAttribute('color', 'danger');
        eliminarButton.innerHTML = '<ion-icon name="trash"></ion-icon>';
        eliminarButton.addEventListener('click', () => this.eliminarUsuario(data.id));

        const cell = row.getElementsByTagName('td')[3];
        cell.innerHTML = '';
        cell.appendChild(editarButton);
        cell.appendChild(eliminarButton);
      }
    });
    tablaUsuarios.draw();
  }

  async abrirModalEditarUsuario(id: number) {
    const result = this.usuariosLista.filter((item: any) => item.id === id);
    const modalUsuario = await this.modal.create({
      component: EditarUsuarioComponent,
      componentProps: {
        usuario: result,
        rolesUsuario: this.rolesUsuario
      }
    });

    await modalUsuario.present();

    const { data } = await modalUsuario.onDidDismiss();

    if (data) {
      (await this.api.editUsuario(id, data, this.userToken.token)).subscribe({
        next: (val) => {
          this.presentToast('bottom', 'Se ha editado un nvueo usuario', 'success');
          setTimeout(() => {
            if(this.userToken.user.id == id){
              this.logout();
            }else{
              window.location.reload();
            }
          }, 300);
        }, error: (err) => {
          this.presentToast('bottom', 'Algo ha salido mal', 'danger');
        }
      })
    }
  }

  async logout() {
    this.storage.logout();
    this.authService.logout()
  }

  async eliminarUsuario(id: number) {
    (await this.api.deleteUsuario(id, this.userToken.token)).subscribe({
      next: (val) => {
        this.presentToast('bottom', 'Se ha eliminado un usuario', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }, error: (err) => {
        this.presentToast('bottom', 'Algo ha salido mal', 'danger');
      }
    })
  }

  async onSubmit() {
    console.log(this.formularioUsuario.value)
    if (this.formularioUsuario.valid) {
      (await this.api.createUsuario(this.formularioUsuario.value, this.userToken.token)).subscribe({
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
