import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LaravelService {

  // URL DEL SERVICIO
  private api = "http://127.0.0.1:8000/api/"

  // Creación de un encabezado para utilizarlo en las peticiones
  private headerCreate(token: string, tipo: string) {
    let httpHeader = {}
    if(tipo == 'get'){
      httpHeader = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      }
    }else{
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
  async getMedidoresTurbian(bearerToken:string) {
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/equipo/turbina`, header)
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getMedidorTurbinaById(id:number, bearerToken:string){
    const header = this.headerCreate(bearerToken, 'get')
    return this.http.get(`${this.api}v1/equipo/turbina/${id}`);
  }
  // Agregar un nuevo medidor
  async createMedidorTurbina(data:any, bearerToken:string){
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.post(`${this.api}v1/equipo/turbina`, data);
  }
  // Editar un medidor
  async editMedidorTurbina(id:number, data:any, bearerToken:string){
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.put(`${this.api}v1/equipo/turbina/${id}`, data);
  }
  // Eliminar un medidor
  async deleteMedidorTurbina(id:number, bearerToken:string){
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.delete(`${this.api}v1/equipo/turbina/${id}`);
  }
  // Consultar el historial de mantenimiento de un equipo
  async getMedidorTurbinaMantenimiento(id:number, bearerToken:string){
    const header = this.headerCreate(bearerToken, 'cud')
    return this.http.get(`${this.api}v1/equipo/turbina/mantenimiento/${id}`);
  }

  async pruebaFacturaget(){
  }
}
