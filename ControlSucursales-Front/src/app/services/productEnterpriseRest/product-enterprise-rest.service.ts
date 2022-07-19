import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EnterpriseRestService } from '../enterpriseRest/enterprise-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProductEnterpriseRestService {

  httpOptions = new HttpHeaders({
    'Content-type': 'application/json',
    'Authorization': this.enterpriseRest.getToken()
  });

  constructor(
    private http: HttpClient,
    private enterpriseRest: EnterpriseRestService
  ) { }

  getProducts(){
    return this.http.get(environment.baseUrl + 'productEnterprise/getProductsEnterprise', {headers: this.httpOptions});
  }

  addProduct(params:{}){
    return this.http.post(environment.baseUrl + 'productEnterprise/addProduct', params, {headers:this.httpOptions});
  }

  getProduct(id:string){  
    return this.http.get(environment.baseUrl + 'productEnterprise/getProductEnterprise/' + id, {headers: this.httpOptions});
  }

  updateProduct(id:string,params:{}){
    return this.http.put(environment.baseUrl + 'productEnterprise/updateProductEnterprise/' + id, params, {headers: this.httpOptions});
  }

  deleteProduct(id:string){
    return this.http.delete(environment.baseUrl + 'productEnterprise/deleteProductEnterprise/' + id, {headers:this.httpOptions});
  }

  distributeProducts(params:{}){
    return this.http.post(environment.baseUrl + 'productEnterprise/distributeProducts', params, {headers: this.httpOptions});
  }

}
