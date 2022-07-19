import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnterpriseModel } from 'src/app/models/enterprise.model';
import { EnterpriseRestService } from 'src/app/services/enterpriseRest/enterprise-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  enterprise: EnterpriseModel;
  timer:any;
  confirmPass:string = '';
  pass = '';

  constructor(
    private enterpriseRest: EnterpriseRestService,
    private router: Router
  ) {
    this.enterprise = new EnterpriseModel('','','','','','');
   }

  ngOnInit(): void {
  }

  checkPass(){
    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      if(this.confirmPass != this.enterprise.password){
        Swal.fire({
          title: 'Password doesnt match',
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar:true
          })
        clearTimeout(this.timer);
        this.pass = '';
      }else{
        Swal.fire({
          title: 'Password match',
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar:true
          })
        clearTimeout(this.timer);
        this.pass = 'as';
      }
    }, 1000)
  }

  createEnterprise(registerForm:any){
  this.enterpriseRest.createEnterprise(this.enterprise).subscribe({
    next: (res:any)=>{
      Swal.fire({
        title: res.message,
        icon: 'success',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
      })
      this.router.navigateByUrl('/enterprise/enterprises');
    },
    error: (err)=>{
      Swal.fire({
        title: err.error.message || err.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
      })
    }
  })
  }

}
