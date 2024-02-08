import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string = 'http://127.0.0.1:8000/api/local/auth';

  // Componenete de encabezado para el servicio
  private httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  constructor(
    private http:HttpClient,
    private storage:StorageService,
    private route: Router
  ) { }

  /*  
  Función para validar si el usuario esta authenticado
  */

  async isAuthenticatedUser(){
    const sesionDate = await this.storage.get('sessionDate').then(res => res != new Date() ? true : false);
    const tokenBearer = await this.storage.get('bearerToken').then(res => res != null ? true : false);
    let isAuth:boolean = (sesionDate && tokenBearer) || false;
    return isAuth
  }
  

  /*
  Función para el inicio de sesión en la aplicaicón recibe como parametros:

  @param email: string - email del usuario
  @param password: string - contraseña del usuario
  */
  async login(data:any){
    return this.http.post(`${this.url}/login`, data, this.httpHeader)
  }

  /*
  Función para el registro de usuarios en la plataforma, debe tener los siguientes parametros:

  @param name: string|max:250|no null - Nombre de la persona
  @param email: string|manx:250|no null -  correo electronico de la persona
  @param password: string|min:8|no null| confirmed - Contraseña de la persona
  @param password_confirmation: string|min:8|no null - Confirmación de la contraseña
  */
  async register(data:any){
    return this.http.post(`${this.url}/register`, data, this.httpHeader);
  }

  /*
  Función para la salida de sesión de un usuarioS
  */
  async logout(){
    this.storage.clear();
    this.route.navigate(['login'], {replaceUrl: true});
    return this.http.post(`${this.url}/logout`, true, this.httpHeader);
  }
}
