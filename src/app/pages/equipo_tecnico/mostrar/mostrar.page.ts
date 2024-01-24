import { Component, OnInit } from '@angular/core';
import { LaravelService } from 'src/app/service/api/laravel.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {

  public medidor_turbina:any = []

  constructor(
    private apiLaravel: LaravelService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.obtenerInformacion();
  }

  async obtenerInformacion(){
    (await this.apiLaravel.getMedidoresTurbian('1|cIYsvDBetefTElQiIpUVeGA19DFwh9BMoVqvciay822a1e1e')).subscribe({
      next: (result:any) => {
        this.medidor_turbina = result;
        console.log("result: ", result);
      }, error: (error) => {
        console.log("error: ", error);
      }
    })
  }

  async historialMantenimiento(id:number){
    (await this.apiLaravel.getMedidorTurbinaMantenimiento(id, '')).subscribe({
      next: (result) => {
        console.log("result: ", result);
      }, error: (error) => {
        console.log("error: ", error);
      }
    })
  }

}
