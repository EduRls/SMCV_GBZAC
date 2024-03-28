import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/service/storage/storage.service';
@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
})
export class MainSidebarComponent  implements OnInit {

  public userDataName:any

  constructor(
    private staroge:StorageService
  ) { }

  ngOnInit(): void {
    this.userDataName = this.staroge.getUserData();
    this.userDataName = this.userDataName.user.name;
  }

}
