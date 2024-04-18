import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/service/storage/storage.service';
@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
})
export class MainSidebarComponent  implements OnInit {

  public userDataName:any
  public userDataRol:any;

  constructor(
    private staroge:StorageService
  ) { }

  ngOnInit(): void {
    const dataUser = this.staroge.getUserData();
    this.userDataName = dataUser.user.name;
    this.userDataRol = dataUser.user.id_rol_usuario;
  }

}
