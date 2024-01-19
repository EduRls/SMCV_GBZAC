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
    
  }

  mostrarInformacion(){
    console.log(this.datos)
  }

}
