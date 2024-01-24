import { Component, OnInit } from '@angular/core';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  public equipo: any = [];

  constructor(
    private apiLaravel: LaravelService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    //this.obtenerInformacion()
  }
  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
    });

    await toast.present();
  }

  /*
  async obtenerInformacion(){
    (await this.apiLaravel.getMedidoresTurbian()).subscribe({
      next:(result:any) => {
        console.log("result: ", result);
      }, error:(err) => {
        console.log(err)
      }
    })
  }
  */

  async guardarEquipo() {
    const informacion:any = {
      'modelo_equipo': this.equipo.modelo_equipo,
      'rango_flujo': this.equipo.rango_flujo,
      'rango_temperatura': this.equipo.rango_temperatura,
      'numero_serie': this.equipo.numero_serie,
      'precision': this.equipo.precision,
      'suministro_energia': this.equipo.suministro_energia,
      'salida_modelo': this.equipo.salida_modelo,
      'fecha': this.equipo.fecha
    };
    var informacionCompleta:boolean = Object.values(informacion).some((item:any) => item == undefined || item.trim() == '' ? true: false)
    
    if(!informacionCompleta){
      try {
        (await this.apiLaravel.createMedidorTurbina(informacion, '')).subscribe({
          next:(value) => {
            this.presentToast('bottom', 'El registro se ha agregado de forma éxitosa!')
          },error: (err) => {
            this.presentToast('bottom', 'Hubo un error, por favor, vuelva a intentarlo')
          },
        })
      } catch (error) {
        this.presentToast('bottom', 'Hubo un error, por favor, vuelva a intentarlo')
      }
    }else{
      this.presentToast('bottom', 'Favor de completar los campos')
    }
  }

  async borrarFormulario(){
    this.equipo = [];
  }

}
