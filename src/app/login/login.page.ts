import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { StorageService } from '../service/storage/storage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

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
    private toastController: ToastController,
    private loadCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.user = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', Validators.required]
    });
    if(this.storage.getUserLogged()){
      this.route.navigate(['/panel_control/mostrar'], {replaceUrl: true});
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', mensaje:string, color: "success" | "warning" | "danger") {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: position,
      color: color
    });

    await toast.present();
  }

  async login(){
    if(this.user.valid){
      const loading = await this.loadCtrl.create({
        message: "Iniciando sesión..."
      });
      loading.present();
      (await this.authService.login(this.user.value)).subscribe({
        next: (v:any) => {
          this.storage.setUserLoggedIn(true, v.data);
          this.presentToast('bottom', 'Sesión inicada, bienvenido!! 😎', 'success');
          this.route.navigate(['/panel_control/mostrar'], {replaceUrl: true});
          loading.dismiss();
        }, error:(err) => {
          if(err.error.message == "Invalid credentials"){
            this.presentToast('bottom', 'Datos incorrectos, favor de verificar', 'danger');
          }else{
            this.presentToast('bottom', 'Ha ocurrido un error, vuelva a intentarlo', 'danger');
          }
          loading.dismiss();
        }
      })
      return false
    }else{
      return this.presentToast('bottom', 'Favor de completar los campos', 'warning')
    }
  }

}
