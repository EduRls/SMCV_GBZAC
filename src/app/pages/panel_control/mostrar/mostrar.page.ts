import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.page.html',
  styleUrls: ['./mostrar.page.scss']
})
export class MostrarPage implements OnInit {

  constructor(
    private apiLaravel:LaravelService,
    private authSerivce: AuthService,
    private storage: StorageService,
    private route: Router
  ) { }

  public datos:any = [];
  private token:any;
  

  ngOnInit() {
    
    /*
    this.storage.get('bearerToken').then(res => {
      if(res != null){
        this.getInformaicon(res);
      }else{
        this.route.navigate(['/login'], {replaceUrl: true});
      }
    })
    */
  }

  async getInformaicon(token:string){
    (await this.apiLaravel.getMedidoresTurbian(token)).subscribe({
      next: (res) => {
        console.log("res: ", res);
      }, error: (err) => {
        console.log("err: ", err);
      }
    })
  }

  async mostrarInformacion(){
    
  }

}
