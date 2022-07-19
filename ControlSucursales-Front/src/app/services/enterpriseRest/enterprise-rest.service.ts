import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class EnterpriseRestService {
  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
  'Authorization': this.getToken()
});

  constructor(private http: HttpClient) {}

    login(params:{}){
      return this.http.post(environment.baseUrl +  'enterprise/login', params, {headers: this.httpOptions});
    }

    createEnterprise(params:{}){
      return this.http.post(environment.baseUrl + 'enterprise/createEnterprise', params, {headers: this.httpOptions});
    }
  
    getToken(){
      let globalToken = localStorage.getItem('token');
      let token;
      if(globalToken != undefined){
        token = globalToken;
      }else{
        token = '';
      }
      return token;
    }

    getIdentity(){
      let globalIdentity = localStorage.getItem('identity');
      let identity;
      if(globalIdentity != undefined){
        identity = JSON.parse(globalIdentity);
      }else{
        identity = '';
      }
      return identity;
    }

    getEnterprises(){
      return this.http.get(environment.baseUrl + 'enterprise/getEnterprises', {headers: this.httpOptions});
    }
    
    saveEnterprise(params:{}){
      return this.http.post(environment.baseUrl + 'enterprise/saveEnterprise', params, {headers: this.httpOptions});
    }
  
    getEnterprise(id:string){
      return this.http.get(environment.baseUrl + 'enterprise/getEnterprise/' + id, {headers: this.httpOptions});
    }
  
    updateEnterprise(id:string, params:{}){
      return this.http.put(environment.baseUrl + 'enterprise/updateEnterprise/' + id, params, {headers: this.httpOptions});
    }
  
    deleteEnterprise(id:string){
      return this.http.delete(environment.baseUrl + 'enterprise/deleteEnterprise/' + id, {headers: this.httpOptions});
    }
}
