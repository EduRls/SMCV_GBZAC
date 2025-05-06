import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import DataTable from 'datatables.net-dt';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditarPipaComponent } from 'src/app/componente/editar-pipa/editar-pipa.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {

  formularioPipa: FormGroup | any;

  // Variables para el listado de pipas
  public pipas: any;

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
    private route:Router 
  ) { }

  ngOnInit() {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }
  }

  async ionViewDidEnter(){
    await this.getInformacion();
    this.formularioPipa = this.formBuilder.group({
      id_planta: [this.token.user.id_planta ,Validators.required],
      clave_pipa: ['', Validators.required],
      localizacion_descripcion_pipa: ['', Validators.required],
      vigencia_calibracion_tanque: ['', Validators.required],
      responsable_pipa: ['', Validators.required],
      capacidad_pipa: ['', Validators.required],
      capacidad_operativa: ['', Validators.required],
      capacidad_util: ['', Validators.required],
      capacidad_fondaje: ['', Validators.required],
      volumen_minimo_operacion: ['', Validators.required],
      estado_tanque: ['', Validators.required]
    });
  }

  async getInformacion() {
    this.token = this.storage.getUserData();
    // Obtener la infromaicón de la pipa
    (await this.api.getPipas(this.token.token, this.token.user.id_planta)).subscribe((response: any) => {
      this.pipas = response;
      this.generarTablaPipa(response);
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

  async generarTablaPipa(data: any) {
    setTimeout(() => {}, 300);
    let tablaPipas = new DataTable('#listaPipas', {
      language: {
        url: "/assets/utils/es-ES.json"
      },
      columns: [
        { data: 'clave_pipa', title: 'Identificador' },
        { data: 'responsable_pipa', title: 'Responsable' },
        { data: 'capacidad_pipa', title: 'Capacidad' },
        { title: 'Operaciones', orderable: false, searchable: false, data: null }
      ],
      data: data,
      createdRow: (row: any, data: any, dataIndex: any) => {
        const editarButton = document.createElement('ion-button');
        editarButton.setAttribute('size', 'small');
        editarButton.innerHTML = '<ion-icon name="create"></ion-icon>';
        editarButton.addEventListener('click', () => this.abrirModalEditarPipa(data.id));
        editarButton.style.marginRight = '15%';

        const eliminarButton = document.createElement('ion-button');
        eliminarButton.setAttribute('size', 'small');
        eliminarButton.setAttribute('color', 'danger');
        eliminarButton.innerHTML = '<ion-icon name="trash"></ion-icon>';
        eliminarButton.addEventListener('click', () => this.eliminarPipa(data.id));

        const cell = row.getElementsByTagName('td')[3];
        cell.innerHTML = '';
        cell.appendChild(editarButton);
        cell.appendChild(eliminarButton);
      }
    });
  }

  async abrirModalEditarPipa(id: any) {
    const pipa = this.pipas.find((p: any) => p.id === id);
    const modal = await this.modalController.create({
      component: EditarPipaComponent,
      componentProps: {
        pipa: pipa
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
        ; (await this.api.editPipa(id, data, this.token.token)).subscribe(res => {
          this.presentToast('bottom', 'Registro editado correctamente', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
    }
  }

  async eliminarPipa(id: any) {
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
              (await this.api.deletePipa(id, this.token.token)).subscribe(res => {
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
    if (this.formularioPipa.valid) {
      (await this.api.createPipa(this.formularioPipa.value, this.token.token)).subscribe({
        next: () => {
          this.presentToast('bottom', 'Se agregado un registro!', 'success')
          this.formularioPipa.reset();
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
