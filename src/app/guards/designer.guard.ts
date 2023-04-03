import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DesignerGuard implements CanActivateChild {
  constructor(private _authService: AuthService, private _router: Router) {}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<any> {
    return true;
  }
}
