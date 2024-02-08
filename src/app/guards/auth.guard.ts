import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private route:Router,
    private authService:AuthService
  ){

  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return await this.checkAuth();
  }

  private async checkAuth(){
    const authed = await this.authService.isAuthenticatedUser();
    return authed || this.routeToLogin();
  }

  private routeToLogin(): boolean{
    this.route.navigate(['/login'], {replaceUrl: true});
    return false
  }
  
}
