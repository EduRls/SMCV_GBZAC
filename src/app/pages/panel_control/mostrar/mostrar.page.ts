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
    private api: LaravelService,
    private authSerivce: AuthService,
    private storage: StorageService,
    private route: Router
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
  }

  ionViewWillEnter() {
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
    if ($.fn.DataTable.isDataTable('#listaRegistroPipas')) {
      $('#listaRegistroPipas').DataTable().destroy();
    }
    setTimeout(() => {}, 700);
    const tablaRegistroPipas = new DataTable('#listaRegistroPipas', {
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
  }

  async generarTablaAlmacen(data: any) {
    if ($.fn.DataTable.isDataTable('#almacenCombustible')) {
      $('#almacenCombustible').DataTable().destroy();
    }
    setTimeout(() => {}, 700);
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
  }

  async calcularNivelContenedor(data:any){
    //this.cantidadAlmacen1 = ((data[0]['cantidad_final'] * 100) / 125000)/100;
    //this.cantidadAlmacen2 = ((data[1]['cantidad_final'] * 100) / 125000)/100
  }

}
