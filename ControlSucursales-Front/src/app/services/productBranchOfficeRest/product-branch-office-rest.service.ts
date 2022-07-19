import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnterpriseRestService } from '../enterpriseRest/enterprise-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProductBranchOfficeRestService {
  httpOptions = new HttpHeaders({
    'Content-type': 'application/json',
    'Authorization': this.enterpriseRest.getToken()
  });

  constructor(
    private http: HttpClient,
    private enterpriseRest: EnterpriseRestService
  ) { }

  getProducts(id:string){
    return this.http.get(environment.baseUrl + 'productBranchOffice/mostSales/' + id, {headers:this.httpOptions});
  }

  getProduct(id:string){
    return this.http.get(environment.baseUrl + 'productBranchOffice/getProductBranchOffice/' + id, {headers:this.httpOptions});
  }

  sellProduct(params:{}){
    return this.http.post(environment.baseUrl + 'productBranchOffice/sellProduct', params, {headers: this.httpOptions});
  }

  orderProducts(id:string){
    return this.http.get(environment.baseUrl + 'productBranchOffice/lessSales/' + id, {headers:this.httpOptions});
  }
}
