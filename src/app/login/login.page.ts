import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { StorageService } from '../service/storage/storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.user = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', Validators.required]
    })
  }

  async login(){
    console.log(this.user.value)
    if(this.user.valid){
      (await this.authService.login(this.user.value)).subscribe({
        next: (v:any) => {
          this.storage.set('bearerToken', v.data.token);
          this.storage.set('sessionDate', new Date());
          this.route.navigate(['/panel_control/mostrar'], {replaceUrl: true});
        }, error:(err) => {
          console.log('Ha ocurrido un error, vuelva a intentarlo')
        }
      })
      return false
    }else{
      return console.log('Favor de completar todos los campos!')
    }
    /*
    (await this.authService.login(user)).subscribe({
      next: (v:any) => {
        this.storage.set('bearerToken', v.data.token);
        environment.authOptions.isloggedUser = true;
        this.route.navigate(['/panel_control/mostrar'], {replaceUrl: true});
      }, error:(err) => {
        console.log('Ha ocurrido un error, vuelva a intentarlo')
      }
    })
    */
  }

}
