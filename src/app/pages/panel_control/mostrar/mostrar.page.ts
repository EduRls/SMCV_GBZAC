import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import * as $ from 'jquery';
import DataTable from 'datatables.net-dt';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss']
})
export class MostrarPage implements OnInit {

  formularioAlmacen: FormGroup | any;

  constructor(
    private api: LaravelService,
    private authSerivce: AuthService,
    private storage: StorageService,
    private route: Router,
    private modal:ModalController,
    private toastController:ToastController
  ) { }

  public datos: any = [];
  private token: any;

  public cantidadAlmacen1:number = 0.2
  public cantidadAlmacen2:number = 0.5


  ngOnInit(): void {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }
    this.generarFormaulario();
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

  async generarFormaulario(){
    this.formularioAlmacen = new FormGroup({
      cantidadInicial: new FormControl('', Validators.required),
      cantidadFinal: new FormControl('', Validators.required),
      fechaLlenado: new FormControl('', Validators.required)
    });
  }

  ionViewDidEnter() {
    this.getInformaicon();
  }

  async getInformaicon() {
    this.token = this.storage.getUserData();
    (await this.api.getRegistroPipasES(this.token.token)).subscribe((res: any) => {
      this.generarTabla(res)
    });
    (await this.api.getRegistroAlmacen(this.token.token)).subscribe((res: any) => {
      this.generarTablaAlmacen(res);
      this.calcularNivelContenedor(res);
    })
  }

  async generarTabla(data: any) {
    if ($.fn.DataTable.isDataTable('#listaRegistroPipasPanel')) {
      $('#listaRegistroPipasPanel').DataTable().destroy();
    }
    setTimeout(() => {
      const tablaRegistroPipas = new DataTable('#listaRegistroPipasPanel', {
        language: {
          url: "/assets/utils/es-ES.json"
        },
        columns: [
          { data: 'id', title: 'Matricula' },
          { data: 'inventario_inical', title: 'Inventario Inicial' },
          { data: 'compra', title: 'Compra' },
          { data: 'venta', title: 'Venta' },
          { data: 'inventario_final', title: 'Inventario Final' }
        ],
        data: data
      });
    }, 300);
    
  }

  async generarTablaAlmacen(data: any) {
    if ($.fn.DataTable.isDataTable('#almacenCombustible')) {
      $('#almacenCombustible').DataTable().destroy();
    }
    setTimeout(() => {
      const tablaRegistroAlmacen = new DataTable('#almacenCombustible', {
        language: {
          url: "/assets/utils/es-ES.json"
        },
        columns: [
          { data: 'nombre_contenedor', title: 'Contenedor' },
          { data: 'cantidad_inical', title: 'Cantidad inicial' },
          { data: 'cantidad_final', title: 'Cantidad final' },
          { data: 'fecha_llenado', title: 'Fecha llenado' },
        ],
        data: data
      });
    }, 300);
    
  }

  async calcularNivelContenedor(data:any){
    //this.cantidadAlmacen1 = ((data[0]['cantidad_final'] * 100) / 125000)/100;
    //this.cantidadAlmacen2 = ((data[1]['cantidad_final'] * 100) / 125000)/100
  }

  async submitForm(almacen:any) {
    if (this.formularioAlmacen.valid) {
      if(almacen == 'c1'){
        const data = {
          'nombre_contenedor': 'Almacen 1',
          'cantidad_inical': this.formularioAlmacen.value.cantidadInicial,
          'cantidad_final': this.formularioAlmacen.value.cantidadFinal,
          'fecha_llenado': this.formularioAlmacen.value.fechaLlenado
        }
        ;(await this.api.createRegistroAlmacen(data, this.token.token)).subscribe({
          next:(val) => {
            this.presentToast('bottom', 'Se ha creado un nuevo registro', 'success');
            this.formularioAlmacen.reset();
            this.modal.dismiss();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }, error:(err) => {
            console.log(err);
            this.presentToast('bottom', 'Algo ha salido mal, vuelve a intentarlo', 'danger');
          }
        })
      }else if(almacen == 'c2'){
        const data = {
          'nombre_contenedor': 'Almacen 2',
          'cantidad_inical': this.formularioAlmacen.value.cantidadInicial,
          'cantidad_final': this.formularioAlmacen.value.cantidadFinal,
          'fecha_llenado': this.formularioAlmacen.value.fechaLlenado
        }
        ;(await this.api.createRegistroAlmacen(data, this.token.token)).subscribe({
          next:(val) => {
            this.presentToast('bottom', 'Se ha creado un nuevo registro', 'success');
            this.formularioAlmacen.reset();
            this.modal.dismiss();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }, error:(err) => {
            console.log(err);
            this.presentToast('bottom', 'Algo ha salido mal, vuelve a intentarlo', 'danger');
          }
        })
      }
    } else {
      // Si el formulario no es válido, puedes mostrar mensajes de error o tomar otras acciones
      console.log("Formulario inválido");
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.formularioAlmacen.reset();
  }

}
