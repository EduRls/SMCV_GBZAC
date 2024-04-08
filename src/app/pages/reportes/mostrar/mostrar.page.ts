import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import DataTable from 'datatables.net-dt';
import * as $ from 'jquery';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { PreviewJsonReportesComponent } from 'src/app/componente/preview-json-reportes/preview-json-reportes.component';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {

  //Informacion del usuario
  private token:any;

  public habilitarMes: boolean = true;
  private tipoReporte: any;

  // Generación de las tablas
  public tablaRDiarioGenerada:boolean = false;
  public tablaRMensualGenerada:boolean = false;
  public generacionJson:boolean = false;
  public habilitarBoton:boolean = true;

  // Reportes generados
  public reportes:any;

  constructor(
    private storage:StorageService,
    private api:LaravelService,
    private load:LoadingController,
    private modal:ModalController
  ) { }

  ngOnInit() {
    this.getInformacion();
  }

  getInformacion(){
    
  }

  async onSelectElement(event: any) {
    this.tipoReporte = event.target.value;
    this.habilitarMes = false;
  }

  // En tu método onSelectElementMonth
  async onSelectElementMonth(event: any) {
    let fechaSeleccionada:any;
    if(event.target.value == undefined){
      let date = new Date();
      fechaSeleccionada = date.getFullYear() + '-' + date.getMonth();
    }else{
      fechaSeleccionada = new Date(event.target.value);
      fechaSeleccionada = fechaSeleccionada.getFullYear() + '-' + fechaSeleccionada.getMonth();
    }
    this.habilitarBoton = false;
    this.token = this.storage.getUserData();
    (await this.api.getReporteVolumetrico(this.token.token, this.token.user.id_planta, fechaSeleccionada)).subscribe({
      next: (val:any) => {
        this.reportes = val
      },error:(err) => {
      console.log("🚀 ~ MostrarPage ~ err:", err)
      }
    })
  }

  async generarReportes(){
    if (this.tipoReporte.includes('diario') && this.tipoReporte.includes('mensual')) {
      this.tablaRMensualGenerada = true;
      this.tablaRDiarioGenerada = true;
      this.generarTablaReporteDiario(this.reportes);
      this.generarTablaReporteMensual(this.reportes);
    } else if (this.tipoReporte.includes('diario')) {
      this.tablaRMensualGenerada = false;
      this.tablaRDiarioGenerada = true;
      this.generarTablaReporteDiario(this.reportes);
    } else if (this.tipoReporte.includes('mensual')) {
      this.tablaRMensualGenerada = true;
      this.tablaRDiarioGenerada = false;
      this.generarTablaReporteMensual(this.reportes);
    }
  }

  // Método para generar tabla mensual
  async generarTablaReporteMensual(data:any) {
    const loadTabla = await this.load.create({
      message: 'Generando tabla...',
      duration: 1000
    });
    await loadTabla.present()
    if ($.fn.DataTable.isDataTable('#tablaReporteMensual')) {
      $('#tablaReporteMensual').DataTable().destroy();
    }
    setTimeout(() => {
      let tablaReporteMensual = new DataTable('#tablaReporteMensual', {
        language: {
          url: "/assets/utils/es-ES.json"
        },
        data: [data], // Pasamos los datos recibidos como argumento
        columns: [
          { title: 'Identificador', data: 'Version' }, // Definimos las columnas y especificamos qué datos mostrar en cada una
          { title: 'Fecha del reporte', data: 'FechaYHoraReporteMes' },
          { title: 'Operaciones', orderable: false, searchable: false, data: null }
        ],
        createdRow: (row: any, data: any, dataIndex: any) => {
          const editarButton = document.createElement('ion-button');
          editarButton.setAttribute('size', 'small');
          editarButton.innerHTML = '<ion-icon name="code-download-outline"></ion-icon>';
          editarButton.addEventListener('click', () => this.exportarJsonReporte(data.id));
          editarButton.style.marginRight = '15%';
  
          const eliminarButton = document.createElement('ion-button');
          eliminarButton.setAttribute('size', 'small');
          eliminarButton.setAttribute('color', 'warning');
          eliminarButton.innerHTML = '<ion-icon name="eye-outline"></ion-icon>';
          eliminarButton.addEventListener('click', () => this.preViewJsonReporte(data.id));
  
          const cell = row.getElementsByTagName('td')[2];
          cell.innerHTML = '';
          cell.appendChild(editarButton);
          cell.appendChild(eliminarButton);
        }
      });
    }, 300);
  }

  async generarTablaReporteDiario(data:any) {
    if ($.fn.DataTable.isDataTable('#tablaReporteDiario')) {
      $('#tablaReporteDiario').DataTable().destroy();
    }
    const loadTabla = await this.load.create({
      message: 'Generando tabla...',
      duration: 1000
    });
    await loadTabla.present()
    setTimeout(() => {
      let tablaReporteDiario = new DataTable('#tablaReporteDiario', {
        language: {
          url: "/assets/utils/es-ES.json"
        },
        data: [data],
        columns: [
          { title: 'Identificador', data: 'Version' },
          { title: 'Fecha del reporte', data: 'FechaYHoraReporteMes' },
          { title: 'Operaciones', orderable: false, searchable: false, data: null }
        ],
        createdRow: (row: any, data: any, dataIndex: any) => {
          const editarButton = document.createElement('ion-button');
          editarButton.setAttribute('size', 'small');
          editarButton.innerHTML = '<ion-icon name="code-download-outline"></ion-icon>';
          editarButton.addEventListener('click', () => this.exportarJsonReporte(data.id));
          editarButton.style.marginRight = '15%';
  
          const eliminarButton = document.createElement('ion-button');
          eliminarButton.setAttribute('size', 'small');
          eliminarButton.setAttribute('color', 'warning');
          eliminarButton.innerHTML = '<ion-icon name="eye-outline"></ion-icon>';
          eliminarButton.addEventListener('click', () => this.preViewJsonReporte(data.id));
  
          const cell = row.getElementsByTagName('td')[2];
          cell.innerHTML = '';
          cell.appendChild(editarButton);
          cell.appendChild(eliminarButton);
        }
      });
      
    }, 300);
  }

  exportarJsonReporte(id:number){

  }

  async preViewJsonReporte(id:number){
    const modalJson = this.modal.create({
      component: PreviewJsonReportesComponent,
      componentProps: {
        informacionReporte: this.reportes
      }
    });
    (await modalJson).present();
  }
}
