import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {
  constructor(private router: Router){

  }
  async canActivate(){
    const isLogin = await localStorage.getItem('isLogin')
    if(isLogin){
      return true;
    } else {
      this.router.navigateByUrl('/login')
    }
  }
  
}
