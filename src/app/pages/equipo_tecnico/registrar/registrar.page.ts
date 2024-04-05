import { Component, OnInit } from '@angular/core';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { ModalController, ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import DataTable from 'datatables.net-dt';
import { EditarMedidorComponent } from 'src/app/componente/editar-medidor/editar-medidor.component';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  formularioMedidorTurbina: FormBuilder | any;

  public equipo: any = [];
  private bearerToken:any;

  constructor(
    private apiLaravel: LaravelService,
    private toastController: ToastController,
    private storage:StorageService,
    private route:Router,
    private formBuilder:FormBuilder,
    private modal:ModalController
  ) { }

  ngOnInit() {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }
  }

  ionViewDidEnter(){
    this.obtenerInformacion();
    this.generarFormaulario();
  }

  async generarFormaulario(){
    this.formularioMedidorTurbina = this.formBuilder.group({
      id_planta: [this.bearerToken.user.id_planta ,Validators.required],
      modelo_equipo: ['', Validators.required],
      rango_flujo: ['', Validators.required],
      rango_temperatura: ['', Validators.required],
      numero_serie: ['', Validators.required],
      precision: ['', Validators.required],
      suministro_energia: ['', Validators.required],
      salida_modelo: ['', Validators.required],
      fecha: ['', Validators.required]
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

  async obtenerInformacion(){
    this.bearerToken = this.storage.getUserData();

    //Obtener la lista de los medidores
    (await this.apiLaravel.getMedidoresTurbian(this.bearerToken.token, this.bearerToken.user.id_planta)).subscribe((res:any) => {
      this.generaTablaMedidores(res);
      this.equipo = res;
    })
  }

  async generaTablaMedidores(data:any){
    let tablaMedidores = new DataTable('#listaEquiposTurbina', {
      language: {
        url: "/assets/utils/es-ES.json"
      },
      columns: [
        {data: 'modelo_equipo', title: 'Modelo'},
        {data: 'rango_flujo', title: 'R. Flujo'},
        {data: 'rango_temperatura', title: 'R. Temp'},
        {data: 'numero_serie', title: 'No. Serie'},
        {data: 'precision', title:'Precisión'},
        {data: 'suministro_energia', title: 'S. Energía'},
        {data: 'salida_modelo', title: 'S. Modelo'},
        {data: 'fecha', title: 'Fecha'},
        { title: 'Operaciones', orderable: false, searchable: false, data: null }
      ],
      data: data,
      createdRow: (row: any, data: any, dataIndex: any) => {
        const editarButton = document.createElement('ion-button');
        editarButton.setAttribute('size', 'small');
        editarButton.innerHTML = '<ion-icon name="create"></ion-icon>';
        editarButton.addEventListener('click', () => this.abrirModalEditarMedidor(data.id));
        editarButton.style.marginRight = '5%';

        const mantenimientoButton = document.createElement('ion-button');
        mantenimientoButton.setAttribute('size', 'small');
        mantenimientoButton.setAttribute('color', 'secondary');
        mantenimientoButton.innerHTML = '<ion-icon name="hammer"></ion-icon>';
        mantenimientoButton.addEventListener('click', () => this.generarMantnimiento(data.id));

        const eliminarButton = document.createElement('ion-button');
        eliminarButton.setAttribute('size', 'small');
        eliminarButton.setAttribute('color', 'danger');
        eliminarButton.innerHTML = '<ion-icon name="trash"></ion-icon>';
        eliminarButton.addEventListener('click', () => this.eliminarPipa(data.id));

        const cell = row.getElementsByTagName('td')[8];
        cell.innerHTML = '';
        cell.appendChild(editarButton);
        cell.appendChild(mantenimientoButton);
        cell.appendChild(eliminarButton);
      }
    });
  }

  async generarMantnimiento(id:number){

  }

  async eliminarPipa(id:number){
    (await this.apiLaravel.deleteMedidorTurbina(id, this.bearerToken.token)).subscribe({
      next: (val:any) => {
        console.log("🚀 ~ RegistrarPage ~ val:", val)
        this.presentToast('bottom', 'Se ha eliminado un registro, exitosamente!', 'success');
        setTimeout(() => {
          window.location.reload()
        }, 300);
      }, error: (err) => {
        console.log("🚀 ~ RegistrarPage ~ err:", err)
        this.presentToast('bottom', 'Ha ocurrido un error', 'danger');
      }
    })
  }

  async abrirModalEditarMedidor(id:number){
    const result = this.equipo.filter((item:any) => item.id === id);

    const modal = await this.modal.create({
      component: EditarMedidorComponent,
      componentProps: {
        medidor: result
      }
    });

    await modal.present();

    const {data} = await modal.onWillDismiss();
    if(data){
      (await this.apiLaravel.editMedidorTurbina(id, data, this.bearerToken.token)).subscribe({
        next:(val) => {
          console.log(val)
          this.presentToast('bottom', 'Se ha actualizado un registro', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }, error:(err) => {
          console.log(err)
          this.presentToast('bottom', 'Algo ha salido mal', 'danger');
        }
      })
    }
  }

  async onSubmit() {
    if(this.formularioMedidorTurbina.valid){
      try {
        (await this.apiLaravel.createMedidorTurbina(this.formularioMedidorTurbina.value, this.bearerToken.token)).subscribe({
          next:(value) => {
            console.log("🚀 ~ RegistrarPage ~ value:", value)
            this.presentToast('bottom', 'El registro se ha agregado de forma éxitosa!', 'success')
            this.modal.dismiss();
            this.formularioMedidorTurbina.reset();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },error: (err) => {
            console.log("🚀 ~ RegistrarPage ~ err:", err)
            this.presentToast('bottom', 'Hubo un error, por favor, vuelva a intentarlo', 'danger')
          },
        })
      } catch (error) {
        this.presentToast('bottom', 'Hubo un error, por favor, vuelva a intentarlo', 'danger')
      }
    }else{
      this.presentToast('bottom', 'Favor de completar los campos', 'warning')
    }
  }

  async cancel(){
    this.modal.dismiss();
  }

}
