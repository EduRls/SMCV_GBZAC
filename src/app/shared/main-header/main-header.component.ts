import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent  implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {}

  async logout(){
    this.authService.logout()
  }

}
