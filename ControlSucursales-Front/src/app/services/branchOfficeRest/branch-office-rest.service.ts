import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnterpriseRestService } from '../enterpriseRest/enterprise-rest.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchOfficeRestService {
  httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
  'Authorization': this.enterpriseRest.getToken()
});

  constructor(
    private http: HttpClient,
    private enterpriseRest: EnterpriseRestService
    ) {}

  getBranchOffices(){
    return this.http.get(environment.baseUrl + 'branchOffice/getBranchOffices', {headers:this.httpOptions});
  }

  getBranchOffice(id:string){
    return this.http.get(environment.baseUrl + 'branchOffice/getBranchOffice/' + id, {headers:this.httpOptions});
  }

  createBranchOffice(params:{}){
    return this.http.post(environment.baseUrl + 'branchOffice/createBranchOffice', params, {headers:this.httpOptions});
  }

  deleteBranchOffice(id:string){
    return this.http.delete(environment.baseUrl + 'branchOffice/deleteBranchOffice/' + id, {headers:this.httpOptions});
  }

  updateBranchOffice(id:string,params:{}){
    return this.http.put(environment.baseUrl + 'branchOffice/updateBranchOffice/' + id, params, {headers:this.httpOptions});
  }

  obtainBranchOffices(id:string){
    return this.http.get(environment.baseUrl + 'branchOffice/obtainBranchOffices/' + id, {headers: this.httpOptions});
  }
}
