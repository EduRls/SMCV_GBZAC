import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataPaginasService {

  constructor(
    private http:HttpClient
  ) { }

  async consultarInformacion() {
    const infromacion = require('../../../assets/utils/Diario.schema.json');
    return infromacion;
  }
}
