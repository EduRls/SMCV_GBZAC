import { Component, OnInit } from '@angular/core';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss']
})
export class MostrarPage implements OnInit {

  constructor(
    private apiLaravel:LaravelService,
    private authSerivce: AuthService
  ) { }

  public datos:any = [];

  ngOnInit() {
    this.getInformaicon();
  }

  async getInformaicon(){
    (await this.apiLaravel.getMedidoresTurbian('1|cIYsvDBetefTElQiIpUVeGA19DFwh9BMoVqvciay822a1e1e')).subscribe({
      next:(result:any) => {
        console.log("result: ", result);
      }, error:(err:any) => {
        if(err.status == 401 ){
          console.log('SERAS ENVIADO AL login')
        }
      }
    })
  }

  async mostrarInformacion(){
    const user = {
      email: 'eduruelas13@gmail.com',
      password: 'lalo12345'
    }
    ;(await this.authSerivce.login(user)).subscribe({
      next: (v:any) => {
        console.log("v: ", v);
      }, error:(err:any) => {
        console.log("err: ", err);

      }
    })
  }

}
