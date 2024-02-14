import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import * as $ from 'jquery';
import DataTable from 'datatables.net-dt';
import { DataPaginasService } from 'src/app/service/api/data-paginas.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss']
})
export class MostrarPage implements OnInit {

  constructor(
    private apiLaravel: LaravelService,
    private datapagina: DataPaginasService,
    private authSerivce: AuthService,
    private storage: StorageService,
    private route: Router
  ) { }

  public datos: any = [];
  private token: any;


  ngOnInit() {
    let tableAlmacenCombustible = new DataTable('#almacenCombustible', {
      language: {
        url: "/assets/utils/es-ES.json"
      }
    });
    let tableAlmacenPipas = new DataTable('#almacenPipas',{
      language: {
        url: "/assets/utils/es-ES.json"
      }
    })

    this.getInformaicon()
    
  }

  async getInformaicon() {
    this.datapagina.consultarInformacion().then((res) => {console.log(res)})
  }

  async mostrarInformacion() {

  }

}
