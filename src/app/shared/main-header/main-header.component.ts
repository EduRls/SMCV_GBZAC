import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private route: Router
  ) { }

  ngOnInit() {
  }

  async logout() {
    this.storage.logout();
    this.authService.logout()
  }

}
