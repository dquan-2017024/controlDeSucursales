import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnterpriseModel } from 'src/app/models/enterprise.model';
import { EnterpriseRestService } from 'src/app/services/enterpriseRest/enterprise-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  enterprise: EnterpriseModel;

  constructor(
    private enterpriseRest: EnterpriseRestService,
    public router:Router
  ) {
    this.enterprise = new EnterpriseModel('','','','','','');
    
   }

  ngOnInit(): void {
  }
  
  login(){
    this.enterpriseRest.login(this.enterprise).subscribe({
      next: (res:any)=>{
        if(res.message === 'Login successfully'){
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
        localStorage.setItem('token', res.token);
        localStorage.setItem('identity', JSON.stringify(res.enterprise));
        this.router.navigateByUrl('/branchOffice/branchOffices')
        }else{
          console.log(res);
          
          Swal.fire({
            title: res.send.message,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
          });
        }
        
      },
      error: (err)=> {
      console.error();
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
      })}
    })
  }

}
