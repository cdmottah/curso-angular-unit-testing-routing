import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TokenService } from './../services/token.service';
import { AuthService } from './../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {

    // route.params['productId']
    // route.paramMap.get('productId')
    return this.authService.user$
    .pipe(
      map(user => {
        if(!user) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    )
  }

}
