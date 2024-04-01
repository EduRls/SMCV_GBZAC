import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import DataTable from 'datatables.net-dt';
import { MantenimientoTurbinaComponent } from 'src/app/componente/mantenimiento-turbina/mantenimiento-turbina.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {


  public medidor_turbina: any = []
  private brearToken: any;

  public medidor_seleccionado: any;
  public enableMedidor: boolean = true;

  // Variables del medidor
  public mantenimiento_medidor: any;
  public tablaMantenimeitnoGenerada: boolean = false
  public historial_informacion: any;
  public tablaHistorialGenerada: boolean = false;

  // Variables de la base de datos
  public mantenminetos: any;
  public historialMedidores: any;

  // Variable global del medidor
  public idMedidor: number = 0;
  public valorInformacion: any


  constructor(
    private apiLaravel: LaravelService,
    private storage: StorageService,
    private route: Router,
    private modal: ModalController,
    private load: LoadingController,
    private alert: AlertController
  ) { }

  ngOnInit() {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }
  }

  ionViewWillEnter() {
    this.obtenerInformacion();
  }

  async obtenerInformacion() {
    this.brearToken = this.storage.getUserData();
    (await this.apiLaravel.getMedidoresTurbian(this.brearToken.token)).subscribe({
      next: (result: any) => {
        this.medidor_turbina = result;
      }, error: (error) => {
        console.log("error: ", error);
      }
    });
    (await this.apiLaravel.getRegistroMantenimientoMedidor(this.brearToken.token)).subscribe({
      next: (value) => {
        this.mantenminetos = value;
      }, error: (error) => {
        console.log(error)
      }
    });
    (await this.apiLaravel.getRegistroInformacionMedidor(this.brearToken.token)).subscribe({
      next:(value) => {
        this.historial_informacion = value
      },error:(error) => {
        console.log(error)
      }
    })
  }

  async historialMantenimiento(id: number) {
    (await this.apiLaravel.getRegistroMantenimientoMedidor(this.brearToken.token)).subscribe({
      next: (response: any) => {
        const result = response.filter((item: any) => item.id_medidor == id)

        this.generarModalMantemineito(result);
      }, error: (error) => {
        console.log("error: ", error);
      }
    })
  }

  async generarModalMantemineito(data: any) {
    const modalMantenimiento = await this.modal.create({
      component: MantenimientoTurbinaComponent,
      componentProps: {
        mantenimiento: data
      }
    });

    await modalMantenimiento.present();
  }


  async onSelectElement(event: any) {
    const result = this.medidor_turbina.filter((item: any) => item.id == event.target.value)
    this.medidor_seleccionado = result;
    this.idMedidor = event.target.value;
    await this.generarTablaMedidorSeleccionado(result)
  }

  async generarTablaMedidorSeleccionado(data: any) {
    const load = await this.load.create({
      message: 'Cargando...',
    });
    load.present();
    if ($.fn.DataTable.isDataTable('#tableMedidorSeleccionado')) {
      $('#tableMedidorSeleccionado').DataTable().destroy();
    }
    //Generación de una tabla
    let generarTablaMedidorSeleccionado = new DataTable("#tableMedidorSeleccionado", {
      language: {
        url: "/assets/utils/es-ES.json"
      },
      data: data,
      columns: [
        { data: 'modelo_equipo', title: 'Modelo' },
        { data: 'rango_flujo', title: 'R. Flujo' },
        { data: 'rango_temperatura', title: 'R. Temp' },
        { data: 'numero_serie', title: 'No. Serie' },
        { data: 'precision', title: 'Precisión' },
        { data: 'suministro_energia', title: 'S. Energía' },
        { data: 'salida_modelo', title: 'S. Modelo' },
        { data: 'fecha', title: 'Fecha' },
      ],
      paging: false,
      searching: false,
      info: false
    });
    this.valorInformacion = undefined;
    this.tablaMantenimeitnoGenerada = false;
    setTimeout(() => {
    }, 1000);
    load.dismiss();
    this.enableMedidor = false;
  }

  async onSelectInformacion(event: any) {
    const resultado = event.target.value.map((item: any) => {
      if (item == 'mantenimiento') {
        return this.generarMantenimientoTable()
      } else if (item == 'info_historial') {
        return this.generarHistorialInformacionTable()
      } else {
        return null
      }
    });
  }

  async generarMantenimientoTable() {
    const result = this.mantenminetos.filter((item: any) => item.id_medidor == this.idMedidor);
    if (result.length != 0) {
      this.tablaMantenimeitnoGenerada = true;
      const loadMantenimiento = await this.load.create({
        message: 'Cargando...'
      });
      await loadMantenimiento.present()
      if ($.fn.DataTable.isDataTable('#tableMantenimientoSelecionado')) {
        $('#tableMantenimientoSelecionado').DataTable().destroy();
      }
      let tablaMantenimiento = new DataTable('#tableMantenimientoSelecionado', {
        language: {
          url: "/assets/utils/es-ES.json"
        },
        data: result,
        columns: [
          {
            data: 'tipo_mantenimiento',
            title: 'Tipo de mantenimiento'
          },
          {
            data: 'responsable',
            title: 'Responsable del mantenimiento'
          },
          {
            data: 'estado',
            title: 'observaciones'
          },
          {
            data: 'created_at',
            title: 'Fecha del mantenimiento'
          }
        ]
      });
      setTimeout(() => {
      }, 1000);
      await loadMantenimiento.dismiss();
    } else {
      const alertMantenimiento = await this.alert.create({
        "message": "No se han encontrado registros de mantenimientos",
        "buttons": [
          {
            text: "Aceptar",
            role: "confirm"
          }
        ]
      });
      await alertMantenimiento.present();
    }
  }

  async generarHistorialInformacionTable() {
    const result = this.historial_informacion.filter((item: any) => item.id_medidor == this.idMedidor);
    if (result.length != 0) {
      this.tablaHistorialGenerada = true;
      const loadHistorial = await this.load.create({
        message: 'Cargando...'
      });
      await loadHistorial.present();
      if ($.fn.DataTable.isDataTable('#tableInformacionSelecionado')) {
        $('#tableInformacionSelecionado').DataTable().destroy();
      }
      let tablaHisotiralInformacion = new DataTable('#tableInformacionSelecionado', {
        language: {
          url: "/assets/utils/es-ES.json"
        },
        data: result,
        columns: [
          {
            data: 'informacion_medidor',
            title: 'Informacion del medidor'
          },
          {
            data: 'created_at',
            title: 'Fecha del registro'
          }
        ]
      });
      setTimeout(() => {}, 1000);
      await loadHistorial.dismiss();
    } else {
      const alertInformacion = await this.alert.create({
        "message": "No se han encontrado registros historial de infromaicón del medidor",
        "buttons": [
          {
            text: "Aceptar",
            role: "confirm"
          }
        ]
      });
      await alertInformacion.present();
    }
  }
}