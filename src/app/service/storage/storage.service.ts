import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  //Variables de entorno
  private isUserLogged = false;
  private userData:any;
  private readonly STORAGE_KEY = "userLoggedIn";
  private readonly USER_dATA_KEY = "userData";

  constructor(
    private route:Router
  ){
    const storedSatatus = localStorage.getItem(this.STORAGE_KEY);
    if(storedSatatus !== null){
      this.isUserLogged = JSON.parse(storedSatatus);
    }

    const storedUserSatatus = localStorage.getItem(this.USER_dATA_KEY);
    if(storedUserSatatus !== null){
      this.userData = JSON.parse(storedUserSatatus);
    }
  }

  setUserLoggedIn(status:boolean, userData?: any){
    this.isUserLogged = status;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status));

    if(userData){
      this.userData = userData;
      localStorage.setItem(this.USER_dATA_KEY, JSON.stringify(userData));
    }
  }

  getUserLogged(){
    return this.isUserLogged;
  }

  getUserData(){
    return this.userData;
  }

  logout(){
    // Limpiar el estado de sesión y los datos del usuario
    this.isUserLogged = false;
    this.userData = null

    // Eliminar los datos del usuario
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_dATA_KEY);
  }

  
  
}
