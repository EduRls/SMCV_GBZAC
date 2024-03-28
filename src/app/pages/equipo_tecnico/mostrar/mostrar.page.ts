import { Component, OnInit } from '@angular/core';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {

  public medidor_turbina:any = []
  private brearToken:string = ''

  constructor(
    private apiLaravel: LaravelService,
    private storage:StorageService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.obtenerInformacion(this.brearToken);
  }

  async obtenerInformacion(token:string){
    (await this.apiLaravel.getMedidoresTurbian(token)).subscribe({
      next: (result:any) => {
        this.medidor_turbina = result;
        console.log("result: ", result);
      }, error: (error) => {
        console.log("error: ", error);
      }
    })
  }

  async historialMantenimiento(id:number){
    (await this.apiLaravel.getMedidorTurbinaMantenimiento(id, this.brearToken)).subscribe({
      next: (result) => {
        console.log("result: ", result);
      }, error: (error) => {
        console.log("error: ", error);
      }
    })
  }

}
