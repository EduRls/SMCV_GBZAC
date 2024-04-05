import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import DataTable from 'datatables.net-dt';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditarRegistroPipasComponent } from 'src/app/componente/editar-registro-pipas/editar-registro-pipas.component';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-registrar-entrada-salida',
  templateUrl: './registrar-entrada-salida.page.html',
  styleUrls: ['./registrar-entrada-salida.page.scss'],
})
export class RegistrarEntradaSalidaPage implements OnInit {

  formularioRegistro: FormGroup | any;

  // Variables para el listado de pipas
  public registros: any;

  // Variable token
  private token: any;

  constructor(
    private api: LaravelService,
    private storage: StorageService,
    private modal: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
    private route: Router
  ) { }

  ngOnInit() {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }

  }

  ionViewDidEnter() {
    this.formularioRegistro = this.formBuilder.group({
      inventario_inical: ['', Validators.required],
      compra: ['', Validators.required],
      venta: ['', Validators.required],
      inventario_final: ['', Validators.required]
    });
    this.getInformacion();
  }

  async getInformacion() {
    this.token = this.storage.getUserData();

    (await this.api.getRegistroPipasES(this.token.token, this.token.user.id_planta)).subscribe({
      next: (val: any) => {
        console.log("🚀 ~ RegistrarEntradaSalidaPage ~ val:", val)
        this.registros = val
        this.generarTablaRegistroPipa(val)
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  async generarTablaRegistroPipa(data: any) {
    if ($.fn.DataTable.isDataTable('#listaRegistroPipas')) {
      $('#listaRegistroPipas').DataTable().destroy();
    }
    setTimeout(() => { }, 300);
    let tablaRegistroPipas = new DataTable('#listaRegistroPipas', {
      destroy: true,
      language: {
        url: "/assets/utils/es-ES.json"
      },
      columns: [
        { data: 'id_pipa', title: 'Matricula' },
        { data: 'inventario_inical', title: 'Inventario Inicial' },
        { data: 'compra', title: 'Compra' },
        { data: 'venta', title: 'Venta' },
        { data: 'inventario_final', title: 'Inventario Final' },
        { title: 'Operaciones', searchable: false, data: null }
      ],
      data: data,
      createdRow: (row: any, data: any, dataIndex: any) => {
        const editarButton = document.createElement('ion-button');
        editarButton.setAttribute('size', 'small');
        editarButton.innerHTML = '<ion-icon name="create"></ion-icon>';
        editarButton.addEventListener('click', () => this.abrirModalEditarRegistroPipa(data.id));
        editarButton.style.marginRight = '15%';

        const eliminarButton = document.createElement('ion-button');
        eliminarButton.setAttribute('size', 'small');
        eliminarButton.setAttribute('color', 'danger');
        eliminarButton.innerHTML = '<ion-icon name="trash"></ion-icon>';
        eliminarButton.addEventListener('click', () => this.eliminarRegistro(data.id));

        const cell = row.getElementsByTagName('td')[5];
        cell.innerHTML = '';
        cell.appendChild(editarButton);
        cell.appendChild(eliminarButton);
      }
    });
  }

  async abrirModalEditarRegistroPipa(id: number) {
    const pipa = this.registros.find((p: any) => p.id === id);
    const modal = await this.modalController.create({
      component: EditarRegistroPipasComponent,
      componentProps: {
        registro: pipa
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log("🚀 ~ RegistrarEntradaSalidaPage ~ abrirModalEditarRegistroPipa ~ data:", data)
        ; (await this.api.editRegistroPipasES(id, data, this.token.token)).subscribe({
          next: (val: any) => {
            this.presentToast('bottom', 'Registro editado correctamente', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }, error: (err) => {
            this.presentToast('bottom', 'Error al editar el registro', 'danger');
          }
        })
    }
  }

  async eliminarRegistro(id: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              (await this.api.deleteRegistroPipasES(id, this.token.token)).subscribe(res => {
                this.presentToast('bottom', 'Registro eliminado correctamente', 'success');
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              });

            } catch (error) {
              console.error('Error al eliminar el registro', error);
              this.presentToast('bottom', 'Error al eliminar el registro', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
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
    if (this.formularioRegistro.valid) {
      // Aquí puedes realizar acciones cuando el formulario sea válido, como enviar los datos a tu servicio API
      (await this.api.createRegistroPipasES(this.formularioRegistro.value, this.token.token)).subscribe({
        next: (val) => {
          this.presentToast('bottom', 'Se ha generado un nuevo registro', 'success');
          this.formularioRegistro.reset();
          this.modal.dismiss();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }, error: (err) => {
          console.log("🚀 ~ RegistrarEntradaSalidaPage ~ err:", err)
          this.presentToast('bottom', 'Algo ha salido mal', 'danger');
        }
      })
    } else {
      // Aquí puedes manejar el caso en que el formulario no sea válido, como mostrar mensajes de error
      console.log('El formulario no es válido');
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
