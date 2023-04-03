import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private _authService: AuthService, private _router: Router) {}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<any | UrlTree> | boolean | UrlTree {
    return this._authService.autoLogin().then((result)=>{
      if(result === false){
        this._authService.logout();
        return false;
      }
      return true;
    })
  }
}
