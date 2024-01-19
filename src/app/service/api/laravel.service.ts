import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LaravelService {

  // URL DEL SERVICIO
  private api = "http://127.0.0.1:8000/api/v1/persons"

  constructor(
    private http:HttpClient
  ) { }

  async getInformacion(){
    return this.http.get(this.api);
  }
}
