import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private route:Router
  ){

  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return await this.checkAuth();
  }

  private async checkAuth(){
    const authed = false;
    return authed || this.routeToLogin();
  }

  private routeToLogin(): boolean{
    this.route.navigate(['/login'], {replaceUrl: true});
    return false
  }
  
}
