import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import * as $ from 'jquery';
import DataTable from 'datatables.net-dt';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss']
})
export class MostrarPage implements OnInit {

  formularioAlmacen: FormGroup;
  public reloj: string = '';


  constructor(
    private api: LaravelService,
    private authSerivce: AuthService,
    private storage: StorageService,
    private route: Router,
    private toastController: ToastController,
    private loadCtrl: LoadingController
  ) { }

  public almacenDatos: any;
  public almacen: any;
  private token: any;
  private registrosEventosAlmacen: any[] = [];
  public cantidadAlmacen1: number = 0;
  public cantidadAlmacenTexto: string = '';

  ngOnInit(): void {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }
    this.actualizarReloj(); // Inicia el reloj
  }

  actualizarReloj() {
    this.reloj = new Date().toLocaleString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  
    setInterval(() => {
      this.reloj = new Date().toLocaleString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }, 1000);
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje: string, color: "success" | "warning" | "danger") {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
      color: color
    });

    await toast.present();
  }

  async ionViewDidEnter() {
    this.token = this.storage.getUserData();
    await this.getInformacion();
    this.generarTablaEventos([]); // precargar tabla vacía con columnas
  }

  async getInformacion() {
    (await this.api.getEventosAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.registrosEventosAlmacen = res;
    });

    (await this.api.getAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.almacenDatos = res;
    });
  }

  async selectAlmacen(event: any) {
    const idAlmacen = event.detail.value;
    this.almacen = this.almacenDatos.filter((item: any) => item.id == idAlmacen);

    const hoy = new Date().toISOString().split('T')[0];
    const eventosFiltrados = this.registrosEventosAlmacen.filter((e: any) =>
      e.id_almacen == idAlmacen && e.created_at.startsWith(hoy)
    );


    this.generarTablaEventos(eventosFiltrados);
    this.actualizarBarraProgreso(idAlmacen);
  }

  async generarTablaEventos(data: any) {
    if ($.fn.DataTable.isDataTable('#almacenCombustible')) {
      $('#almacenCombustible').DataTable().destroy();
    }
    setTimeout(() => {
      const tablaEventos = new DataTable('#almacenCombustible', {
        language: {
          url: "/assets/utils/es-ES.json"
        },
        columns: [
          { data: 'tipo_evento', title: 'Tipo de evento' },
          { data: 'volumen_inicial', title: 'Volumen inicial (L)' },
          { data: 'volumen_movido', title: 'Movimiento (L)' },
          { data: 'volumen_final', title: 'Volumen final (L)' },
          { data: 'fecha_inicio_evento', title: 'Inicio del evento' },
          { data: 'fecha_fin_evento', title: 'Fin del evento' },
          { data: 'observaciones', title: 'Observaciones' }
        ],
        data: data
      });
    }, 300);
  }

  async actualizarBarraProgreso(idAlmacen: number) {
    const eventos = this.registrosEventosAlmacen.filter((e: any) => e.id_almacen == idAlmacen);
    if (eventos.length > 0) {
      const ultimo = eventos.sort((a, b) => new Date(b.fecha_fin_evento).getTime() - new Date(a.fecha_fin_evento).getTime())[0];
      const almacenInfo = this.almacenDatos.find((a: any) => a.id == idAlmacen);
      if (almacenInfo && almacenInfo.capacidad_almacen > 0) {
        const porcentaje = ultimo.volumen_final / almacenInfo.capacidad_almacen;
        this.cantidadAlmacen1 = porcentaje;
        this.cantidadAlmacenTexto = `${(porcentaje * 100).toFixed(1)}% - ${ultimo.volumen_final}L / ${almacenInfo.capacidad_almacen}L`;
      }
    } else {
      this.cantidadAlmacen1 = 0;
      this.cantidadAlmacenTexto = '0% - Sin registros';
    }
  }
}
