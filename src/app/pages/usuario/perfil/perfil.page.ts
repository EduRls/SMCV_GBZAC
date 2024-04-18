import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  user: any;

  private userData: any;

  constructor(
    private storage: StorageService,
    private api: LaravelService,
    private route: Router
  ) { }

  async ngOnInit() {
    if (!this.storage.getUserLogged()) {
      this.storage.logout();
      this.route.navigate(['/login'], { replaceUrl: true });
    }
    this.userData = this.storage.getUserData();
    (await this.api.getUsuarioById(this.userData.token, this.userData.user.id_planta, this.userData.user.id)).subscribe({
      next: (val: any) => {
        this.user = val[0];
      }, error: (err) => {
        console.log("🚀 ~ PerfilPage ~ err:", err)
      }
    })
  }

}
