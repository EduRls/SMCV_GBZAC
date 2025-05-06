import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import DataTable from 'datatables.net-dt';
import { EditarAlmacenComponent } from 'src/app/componente/editar-almacen/editar-almacen.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioAlmacen: FormGroup;

  private token: any;

  public almacenes: any;
  private existencias: any;

  constructor(
    private api: LaravelService,
    private storage: StorageService,
    private modal: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private route: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }
  }

  async ionViewDidEnter() {
    await this.getInformacion();
    this.formularioAlmacen = this.formBuilder.group({
      id_planta: [this.token.user.id_planta, Validators.required],
      clave_almacen: ['', Validators.required],
      localizacion_descripcion_almacen: ['', Validators.required],
      vigencia_calibracion_tanque: ['', Validators.required],
      capacidad_almacen: ['', Validators.required],
      capacidad_operativa: ['', Validators.required],
      capacidad_util: ['', Validators.required],
      capacidad_fondaje: ['', Validators.required],
      volumen_minimo_operacion: ['', Validators.required],
      estado_tanque: ['', Validators.required]
    });
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
    this.token = this.storage.getUserData();

    (await this.api.getAlmacen(this.token.token, this.token.user.id_planta)).subscribe((response: any) => {
      this.almacenes = response;
      this.generarTablaAlmacen(response);
    });

    (await this.api.getExistenciaAlmacen(this.token.token, this.token.user.id_planta)).subscribe((response: any) => {
      this.existencias = response
      console.log(response)
    });
  }

  async generarTablaAlmacen(data: any) {
    setTimeout(() => { }, 300);

    if ($.fn.DataTable.isDataTable('#listaAlmacenes')) {
      $('#listaAlmacenes').DataTable().destroy();
    }


    let tablaPipas = new DataTable('#listaAlmacenes', {
      language: {
        url: "/assets/utils/es-ES.json"
      },
      columns: [
        { data: 'clave_almacen', title: 'Clave almacen' },
        { data: 'vigencia_calibracion_tanque', title: 'Calibración' },
        { data: 'estado_tanque', title: 'Estado del tanque' },
        { title: 'Operaciones', orderable: false, searchable: false, data: null }
      ],
      data: data,
      createdRow: (row: any, data: any, dataIndex: any) => {
        const editarButton = document.createElement('ion-button');
        editarButton.setAttribute('size', 'small');
        editarButton.innerHTML = '<ion-icon name="create"></ion-icon>';
        editarButton.addEventListener('click', () => this.abrirModalEditarAlmacen(data.id));
        editarButton.style.marginRight = '15%';

        const agregarExistenciaButton = document.createElement('ion-button');
        agregarExistenciaButton.setAttribute('size', 'small');
        agregarExistenciaButton.innerHTML = '<ion-icon name="timer"></ion-icon>';
        agregarExistenciaButton.addEventListener('click', () => this.abrirAlertCrearExistencia(data.id));
        agregarExistenciaButton.style.marginRight = '15%';

        const eliminarButton = document.createElement('ion-button');
        eliminarButton.setAttribute('size', 'small');
        eliminarButton.setAttribute('color', 'danger');
        eliminarButton.innerHTML = '<ion-icon name="trash"></ion-icon>';
        eliminarButton.addEventListener('click', () => this.eliminarAlmacen(data.id));

        const cell = row.getElementsByTagName('td')[3];
        cell.innerHTML = '';
        cell.appendChild(editarButton);
        cell.appendChild(agregarExistenciaButton);
        cell.appendChild(eliminarButton);
      }
    });
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }


  async abrirAlertCrearExistencia(id: number) {
    const yaExiste = this.existencias.some((item: any) => item.id_almacen === id);
    console.log(this.existencias)
    if (yaExiste) {
      const alerta = await this.alertCtrl.create({
        header: 'Ya existe',
        message: 'Este almacén ya tiene una existencia registrada.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Registrar existencia inicial',
      inputs: [
        {
          name: 'volumen',
          type: 'number',
          placeholder: 'Volumen inicial (L)'
        },
        {
          name: 'fecha',
          type: 'datetime-local',
          placeholder: 'Fecha y hora de medición'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (val) => {

            if (!val.volumen || !val.fecha) {
              this.presentToast('bottom', 'Por favor completa todos los campos', 'warning');
              return false; // evita que se cierre el alert
            }

            const nuevaExistencia = {
              id_almacen: id,
              volumen_existencia: parseFloat(val.volumen),
              fecha_medicion: val.fecha
            };

            (await this.api.createExistenciaAlmacen(nuevaExistencia, this.token.token)).subscribe({
              next: async () => {
                this.presentToast('bottom', 'Registro agregado correctamente', 'success');
                this.getInformacion()
                return true
              },
              error: async () => {
                this.presentToast('bottom', 'Error al guardar la existencia', 'danger');
                return false
              }
            });
            return null
          }
        }
      ]
    });

    await alert.present();
  }




  async abrirModalEditarAlmacen(id: any) {
    const almacen = this.almacenes.find((p: any) => p.id === id);
    const modal = await this.modal.create({
      component: EditarAlmacenComponent,
      componentProps: {
        almacen: almacen
      },
      cssClass: "modalAlmacen"
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      ; (await this.api.editAlmacen(id, data, this.token.token)).subscribe(res => {
        this.presentToast('bottom', 'Registro editado correctamente', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
    }
  }

  async eliminarAlmacen(id: any) {
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
              (await this.api.deleteAlmacen(id, this.token.token)).subscribe(res => {
                this.presentToast('bottom', 'Registro eliminado correctamente', 'success');
                window.location.reload();
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


  async onSubmit() {
    if (this.formularioAlmacen.valid) {
      (await this.api.createAlmacen(this.formularioAlmacen.value, this.token.token)).subscribe({
        next: () => {
          this.presentToast('bottom', 'Se agregado un registro!', 'success')
          this.formularioAlmacen.reset();
          window.location.reload();
          this.modal.dismiss();
        }, error: (err) => {
          console.log("🚀 ~ MostrarPage ~ err:", err)
          this.presentToast('bottom', 'Algo ha salido mal', 'danger')
        },
      })
    } else {
      // Aquí puedes manejar el caso en que el formulario no sea válido
      console.log("El formulario no es válido");
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
}
