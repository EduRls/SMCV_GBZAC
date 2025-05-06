import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgregarEventoAlmacenComponent } from 'src/app/componente/agregar-evento-almacen/agregar-evento-almacen.component';
import * as $ from 'jquery';
import DataTable from 'datatables.net-dt';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss'],
})
export class MostrarPage implements OnInit {

  private token: any;
  public eventosAlmacenes: any

  public almacenes: any;

  // Seleccion de contendor
  selectedAlmacenId: number | null = null;
  eventosFiltrados: any[] = [];
  mostrarDetalles: boolean = false;

  public existencias: any[] = [];
  public existenciaActual: number = 0;
  public totalRecepciones: number = 0;
  public totalEntregas: number = 0;



  constructor(
    private modalController: ModalController,
    private api: LaravelService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.getInformacion()
  }

  async getInformacion() {

    // Inicializar la tabla vacía
    setTimeout(() => {
      new DataTable('#tablaEventosAlmacen', {
        language: {
          url: "/assets/utils/es-ES.json"
        },
        columns: [
          { data: 'tipo_evento', title: 'Tipo' },
          { data: 'volumen_inicial', title: 'Inicial (L)' },
          { data: 'volumen_movido', title: 'Movimiento (L)' },
          { data: 'volumen_final', title: 'Final (L)' },
          { data: 'fecha_inicio_evento', title: 'Inicio' },
          { data: 'fecha_fin_evento', title: 'Fin' },
          { data: 'observaciones', title: 'Observaciones' },
          { title: 'Acciones', orderable: false, searchable: false, data: null }
        ],
        data: []
      });
    }, 300);

    this.token = this.storage.getUserData();

    (await this.api.getEventosAlmacen(this.token.token, this.token.user.id_planta)).subscribe((response: any) => {
      this.eventosAlmacenes = response;
      console.log(response)
    });

    (await this.api.getAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.almacenes = res;
    });

    (await this.api.getExistenciaAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.existencias = res;
    });
  }



  // Seleccion de un almacen
  async selectAlmacen(event: any) {
    this.selectedAlmacenId = parseInt(event.detail.value);
    this.mostrarDetalles = true;

    // Filtra eventos del almacén seleccionado
    this.eventosFiltrados = this.eventosAlmacenes.filter((eve: any) => eve.id_almacen == this.selectedAlmacenId)
    this.calcularResumenDelTanque();
    if (this.eventosFiltrados.length > 0) {
      this.generarTablaEventos(this.eventosFiltrados);
    } else {
      // limpia la tabla si no hay eventos
      const tabla = $('#tablaEventosAlmacen').DataTable();
      tabla.clear().draw();
    }
  }

  calcularResumenDelTanque() {
    if (!this.selectedAlmacenId) return;
  
    // 1. Obtener eventos del tanque
    const eventos = this.eventosFiltrados;
  
    // 2. Calcular existencia actual
    if (eventos.length > 0) {
      // Ordenar eventos por fecha y tomar el más reciente
      const eventosOrdenados = [...eventos].sort((a, b) =>
        new Date(b.fecha_fin_evento).getTime() - new Date(a.fecha_fin_evento).getTime()
      );
      this.existenciaActual = eventosOrdenados[0].volumen_final;
    } else {
      // No hay eventos, buscar existencia inicial registrada
      const existencia = this.existencias.find(e => e.id_almacen == this.selectedAlmacenId);
      this.existenciaActual = existencia ? existencia.volumen_existencia : 0;
    }
  
    // 3. Sumar recepciones y entregas
    this.totalRecepciones = eventos
      .filter(e => e.tipo_evento === 'entrada')
      .reduce((sum, e) => sum + Number(e.volumen_movido || 0), 0);
  
    this.totalEntregas = eventos
      .filter(e => e.tipo_evento === 'salida')
      .reduce((sum, e) => sum + Number(e.volumen_movido || 0), 0);
  }
  



  async generarTablaEventos(data: any) {

    if ($.fn.DataTable.isDataTable('#tablaEventosAlmacen')) {
      $('#tablaEventosAlmacen').DataTable().destroy();
    }

    new DataTable('#tablaEventosAlmacen', {
      language: { url: "/assets/utils/es-ES.json" },
      columns: [
        { data: 'tipo_evento', title: 'Tipo' },
        { data: 'volumen_inicial', title: 'Inicial (L)' },
        { data: 'volumen_movido', title: 'Movimiento (L)' },
        { data: 'volumen_final', title: 'Final (L)' },
        { data: 'fecha_inicio_evento', title: 'Inicio' },
        { data: 'fecha_fin_evento', title: 'Fin' },
        { data: 'observaciones', title: 'Observaciones' },
        {
          title: 'Acciones',
          orderable: false,
          searchable: false,
          data: null
        }
      ],
      data: data,
      createdRow: (row: any, data: any) => {
        const editarBtn = document.createElement('ion-button');
        editarBtn.setAttribute('size', 'small');
        editarBtn.innerHTML = '<ion-icon name="create"></ion-icon>';
        editarBtn.addEventListener('click', () => this.abrirModalEditarEvento(data.id));
        editarBtn.style.marginRight = '10px';

        const eliminarBtn = document.createElement('ion-button');
        eliminarBtn.setAttribute('size', 'small');
        eliminarBtn.setAttribute('color', 'danger');
        eliminarBtn.innerHTML = '<ion-icon name="trash"></ion-icon>';
        eliminarBtn.addEventListener('click', () => this.eliminarEvento(data.id));

        const cell = row.getElementsByTagName('td')[7];
        cell.innerHTML = '';
        cell.appendChild(editarBtn);
        cell.appendChild(eliminarBtn);
      }
    });
  }



  async abrirModalEditarEvento(id: any) {

  }

  async eliminarEvento(id: any) {

  }



  async addEventoAlmacen() {
    const modalAgregarEventoAlmacen = await this.modalController.create({
      component: AgregarEventoAlmacenComponent,
      cssClass: "modalEventoAlmacen"
    });

    modalAgregarEventoAlmacen.present()
  }

}
