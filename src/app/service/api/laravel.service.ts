import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LaravelService {

  // URL DEL SERVICIO
  private api = environment.urlServidor

  // Creación de un encabezado para utilizarlo en las peticiones
  private headerCreate(token: string, tipo: string) {
    let httpHeader = {}
    if (tipo == 'get') {
      httpHeader = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      }
    } else {
      httpHeader = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token })
      }
    }
    return httpHeader
  }

  constructor(
    private http: HttpClient
  ) { }

  /*
    INICIO CRUD MEDIDORES DE TURBINA
  */
  // Obtención de la informaicón de los medidores
  async getMedidoresTurbian(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/equipo/turbina/${idPlanta}`, header)
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getMedidorTurbinaById(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/equipo/turbina/${id}`);
  }
  // Agregar un nuevo medidor
  async createMedidorTurbina(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/equipo/turbina`, data, header);
  }
  // Editar un medidor
  async editMedidorTurbina(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/equipo/turbina/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteMedidorTurbina(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/equipo/turbina/${id}`, header);
  }

  /*
    INICIO CRUD PIPAS
  */
  // Obtener la infromación de las pipas
  async getPipas(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/pipa/${idPlanta}`, header)
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getPipasById(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/pipa/${id}`);
  }
  // Agregar un nuevo medidor
  async createPipa(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/pipa`, data, header);
  }
  // Editar un medidor
  async editPipa(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/pipa/${id}`, data, header);
  }
  // Eliminar un medidor
  async deletePipa(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/pipa/${id}`, header);
  }

  /*
  INICIO CRUD REGISTRO DE ENTRADAS Y SALIDAS
  */

  // Obtener la infromación de las pipas
  async getRegistroPipasES(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/entrada-salida-pipa/registro/${idPlanta}`, header)
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getRegistroPipasESById(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/entrada-salida-pipa/registro/${id}`);
  }
  // Agregar un nuevo medidor
  async createRegistroPipasES(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/entrada-salida-pipa/registro`, data, header);
  }
  // Editar un medidor
  async editRegistroPipasES(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/entrada-salida-pipa/registro/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteRegistroPipasES(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/entrada-salida-pipa/registro/${id}`, header);
  }

  /*
  INICIO DE REGISTRO DE LLENADO DE COMBUSTIBLE
  */
  // Obtener la infromación de las pipas
  async getRegistroAlmacen(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/almacen-registro/${idPlanta}`, header)
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getRegistroAlmacenById(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/almacen-registro/${id}`);
  }
  // Agregar un nuevo medidor
  async createRegistroAlmacen(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/almacen-registro`, data, header);
  }
  // Editar un medidor
  async editRegistroAlmacen(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/almacen-registro/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteRegistroAlmacen(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/almacen-registro/${id}`, header);
  }

  /*
  INICIO DE REGISTRO DE MANTENIMIENTO DE COMBUSTIBLE
  */
  // Obtener la infromación de las pipas
  async getRegistroMantenimientoMedidor(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/equipo/mantenimiento/${idPlanta}`, header);
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getRegistroMantenimientoMedidorById(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/equipo/mantenimiento/${id}`, header);
  }
  // Agregar un nuevo medidor
  async createRegistroMantenimientoMedidor(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/equipo/mantenimiento`, data, header);
  }
  // Editar un medidor
  async editRegistroMantenimientoMedidor(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/equipo/mantenimiento/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteRegistroMantenimientoMedidor(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/equipo/mantenimiento/${id}`, header);
  }

  /*
  INICIO DE REGISTRO DE HISTORIAL DE LOS MEDIDORES
  */
  // Obtener la infromación de las pipas
  async getRegistroInformacionMedidor(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/medidorT/informacion/${idPlanta}`, header);
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getRegistroInformacionMedidorById(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/medidorT/informacion/${id}`, header);
  }
  // Agregar un nuevo medidor
  async createRegistroInformacionMedidor(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/medidorT/informacion`, data, header);
  }
  // Editar un medidor
  async editRegistroInformacionMedidor(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/medidorT/informacion/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteRegistroInformacionMedidor(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/medidorT/informacion/${id}`, header);
  }

  /*
  INICIO DE INFORMACIÓN GENERAL DEL REPORTE DE CONTROL VOLUMETRICO
  */
  // Obtener la infromación de las pipas
  async getInformacionGeneralReporte(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/reporteVolumetrico/informacion-general/${idPlanta}`, header);
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getInformacionGeneralReporteById(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/reporteVolumetrico/informacion-general/${id}`, header);
  }
  // Agregar un nuevo medidor
  async createInformacionGeneralReporte(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/reporteVolumetrico/informacion-general`, data, header);
  }
  // Editar un medidor
  async editInformacionGeneralReporte(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/reporteVolumetrico/informacion-general/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteInformacionGeneralReporte(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/reporteVolumetrico/informacion-general/${id}`, header);
  }

  // Generación de reporte
  async getReporteVolumetrico(bearerToken: string, idPlanta: number, monthAndYear: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/generar-reporte/${idPlanta}/${monthAndYear}`, header);
  }

  /*
  INICIO DE REGISTRO DE ALMACENES DE GAS
  */
  // Obtener la infromación de las pipas
  async getAlmacen(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/almacen/${idPlanta}`, header)
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getAlmacenById(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/almacen/${id}`);
  }
  // Agregar un nuevo medidor
  async createAlmacen(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/almacen`, data, header);
  }
  // Editar un medidor
  async editAlmacen(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/almacen/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteAlmacen(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/almacen/${id}`, header);
  }

  /*
    INFROMAICÓN DEL USUARIO
  */
  async getUsuarios(bearerToken: string, idPlanta: number) {
    const header = this.headerCreate(bearerToken, 'get');
    return this.http.get(`${this.api}v1/usuario/${idPlanta}`, header);
  }
  async getUsuarioById(bearerToken: string, idPlanta: number, idUsuario: number) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/usuario/${idPlanta}/${idUsuario}`, header)
  }
  // Agregar un nuevo medidor
  async createUsuario(data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/usuario`, data, header);
  }
  // Editar un medidor
  async editUsuario(id: number, data: any, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/usuario/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteUsuario(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/usuario/${id}`, header);
  }


  async getRolUsuario(bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/rol`, header)
  }
}
