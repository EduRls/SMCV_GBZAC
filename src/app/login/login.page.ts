import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { StorageService } from '../service/storage/storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user:FormGroup | any;

  constructor(
    private authService:AuthService,
    private storage:StorageService,
    private route:Router,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.user = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', Validators.required]
    })
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string, icono:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
      icon: icono
    });

    await toast.present();
  }

  async login(){
    if(this.user.valid){
      (await this.authService.login(this.user.value)).subscribe({
        next: (v:any) => {
          this.storage.set('bearerToken', v.data.token);
          this.route.navigate(['/panel_control/mostrar'], {replaceUrl: true});
        }, error:(err) => {
          this.presentToast('bottom', 'Ha ocurrido un error, vuelva a intentarlo', 'close')
        }
      })
      return false
    }else{
      return this.presentToast('bottom', 'Favor de completar los campos', 'close')
    }
  }

}
