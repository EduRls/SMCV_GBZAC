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
  async getMedidoresTurbian(bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/equipo/turbina`, header)
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
    return this.http.put(`${this.api}v1/equipo/turbina/${id}`, data, header);
  }
  // Eliminar un medidor
  async deleteMedidorTurbina(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/equipo/turbina/${id}`, header);
  }
  // Consultar el historial de mantenimiento de un equipo
  async getMedidorTurbinaMantenimiento(id: number, bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.get(`${this.api}v1/equipo/turbina/mantenimiento/${id}`, header);
  }

  /*
    INICIO CRUD PIPAS
  */
  // Obtener la infromación de las pipas
  async getPipas(bearerToken: string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/pipa`, header)
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

}
