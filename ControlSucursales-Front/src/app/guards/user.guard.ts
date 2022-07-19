import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EnterpriseRestService } from '../services/enterpriseRest/enterprise-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    private enterpriseRest: EnterpriseRestService,
  private router:Router
  ){}
  
  canActivate(){
    if(this.enterpriseRest.getToken() != ''){
      return true
    }else{
      this.router.navigateByUrl('');
      return false
    }
  }
  
}
