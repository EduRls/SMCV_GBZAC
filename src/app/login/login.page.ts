import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { StorageService } from '../service/storage/storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService:AuthService,
    private storage:StorageService,
    private route:Router
  ) { }

  ngOnInit() {
  }

  async login(){
    const user = {};
    (await this.authService.login(user)).subscribe({
      next: (v:any) => {
        this.storage.set('bearerToken', v.data.token);
        environment.authOptions.isloggedUser = true;
        this.route.navigate(['/panel_control/mostrar'], {replaceUrl: true});
      }, error:(err) => {
        console.log('Ha ocurrido un error, vuelva a intentarlo')
      }
    })
  }

}
