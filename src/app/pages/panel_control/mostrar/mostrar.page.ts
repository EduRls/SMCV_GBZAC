import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import * as $ from 'jquery';
import DataTable from 'datatables.net-dt';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss']
})
export class MostrarPage implements OnInit {

  formularioAlmacen: FormGroup;

  constructor(
    private api: LaravelService,
    private authSerivce: AuthService,
    private storage: StorageService,
    private route: Router,
    private modal:ModalController,
    private toastController:ToastController,
    private loadCtrl:LoadingController
  ) { }

  public datos: any = [];
  public almacenDatos:any;
  public almacen:any;
  private token: any;

  private registrosAlmacen:any;
  public registrosAlmacenById:any;

  public cantidadAlmacen1:number = 0.2
  public cantidadAlmacen2:number = 0.5


  ngOnInit(): void {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }
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
      id_planta: new FormControl(this.token.user.id_planta ,Validators.required),
      id_almacen: new FormControl('', Validators.required),
      cantidad_inical: new FormControl('', Validators.required),
      cantidad_final: new FormControl('', Validators.required),
      fecha_llenado: new FormControl('', Validators.required)
    });
  }

  async ionViewDidEnter() {
    await this.getInformaicon();
    this.generarFormaulario();
  }

  async getInformaicon() {
    this.token = this.storage.getUserData();
    (await this.api.getRegistroPipasES(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.generarTabla(res)
    });
    (await this.api.getRegistroAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.registrosAlmacen = res;
      console.log("🚀 ~ MostrarPage ~ this.registrosAlmacen:", this.registrosAlmacen)
      this.calcularNivelContenedor(res);
    });
    (await this.api.getAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res:any) => {
      this.almacenDatos = res;
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
          { data: 'almacen.clave_almacen', title: 'Clave del almacen' },
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
    this.formularioAlmacen.get('id_almacen').setValue(almacen);
    if (this.formularioAlmacen.valid) {
      ;(await this.api.createRegistroAlmacen(this.formularioAlmacen.value, this.token.token)).subscribe({
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
    } else {
      // Si el formulario no es válido, puedes mostrar mensajes de error o tomar otras acciones
      console.log("Formulario inválido");
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.formularioAlmacen.reset();
  }

  async selectAlmacen(event:any){
    const load = this.loadCtrl.create({
      message: "Cargando..."
    });
    (await load).present();

    const result = this.almacenDatos.filter((item:any) => item.id == event.target.value);
    
    this.almacen = result;

    const registrosAlmacenById = this.registrosAlmacen.filter((item:any) => item.id_almacen == event.target.value);
    this.generarTablaAlmacen(registrosAlmacenById);
    
    (await load).dismiss();
  }

}
