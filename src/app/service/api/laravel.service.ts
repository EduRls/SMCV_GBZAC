import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LaravelService {

  // URL DEL SERVICIO
  private api = "http://127.0.0.1:8000/api/"

  constructor(
    private http: HttpClient
  ) { }

  /*
    INICIO CRUD MEDIDORES DE TURBINA
  */
  // Obtención de la informaicón de los medidores
  async getMedidoresTurbian() {
    return this.http.get(`${this.api}v1/equipo/turbina`)
  }
  // Obtener información de un medidor de acuerdo a un ID
  async getMedidorTurbinaById(id:number){
    return this.http.get(`${this.api}v1/equipo/turbina/${id}`);
  }
  // Agregar un nuevo medidor
  async createMedidorTurbina(data:any){
    return this.http.post(`${this.api}v1/equipo/turbina`, data);
  }
  // Editar un medidor
  async editMedidorTurbina(id:number, data:any){
    return this.http.put(`${this.api}v1/equipo/turbina/${id}`, data);
  }
  // Eliminar un medidor
  async deleteMedidorTurbina(id:number){
    return this.http.delete(`${this.api}v1/equipo/turbina/${id}`);
  }
}
