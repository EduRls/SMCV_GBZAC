import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string = 'http://127.0.0.1/api/local/auth'

  constructor(
    private http:HttpClient
  ) { }

  /*
  Función para el inicio de sesión en la aplicaicón recibe como parametros:

  @param email: string - email del usuario
  @param password: string - contraseña del usuario
  */
  async login(data:any){
    return this.http.post(`${this.url}/login`, data);
  }

  /*
  Función para el registro de usuarios en la plataforma, debe tener los siguientes parametros:

  @param name: string|max:250|no null - Nombre de la persona
  @param email: string|manx:250|no null -  correo electronico de la persona
  @param password: string|min:8|no null| confirmed - Contraseña de la persona
  @param password_confirmation: string|min:8|no null - Confirmación de la contraseña
  */
  async register(data:any){
    return this.http.post(`${this.url}/register`, data);
  }

  /*
  Función para la salida de sesión de un usuarioS
  */
  async logout(){
    return this.http.post(`${this.url}/logout`, true);
  }
}
