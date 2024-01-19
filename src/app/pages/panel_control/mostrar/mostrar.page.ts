import { Component, OnInit } from '@angular/core';
import { LaravelService } from 'src/app/service/api/laravel.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {

  constructor(
    private laravelApi:LaravelService
  ) { }

  public datos:any = [];

  ngOnInit() {
    this.getInformaicon();
  }

  async getInformaicon(){
    (await this.laravelApi.getInformacion()).subscribe({
      next:(result:any) => {
        this.datos = result;
      },error:(error) => {
        console.log(error)
      }
    })
  }

  mostrarInformacion(){
    console.log(this.datos)
  }

}
