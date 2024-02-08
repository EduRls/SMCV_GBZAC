import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from './service/auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isLoggin:boolean = true;

  constructor(
    private storage:Storage,
    private authService: AuthService,
    private route: Router,
    private platform: Platform
  ) {
    //this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create();
    this.authService.isAuthenticatedUser().then(res => this.isLoggin = res);
  }
}
