import { Component, OnInit } from '@angular/core';
import { EnterpriseRestService } from 'src/app/services/enterpriseRest/enterprise-rest.service';
import { EnterpriseModel } from 'src/app/models/enterprise.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'enterprises',
  templateUrl: './enterprises.component.html',
  styleUrls: ['./enterprises.component.css']
})
export class EnterprisesComponent implements OnInit {
  enterprises:any;
  enterprise: EnterpriseModel;
  enterpriseUpdate:any;

  constructor(
    private enterpriseRest: EnterpriseRestService,
    private router:Router
  ) { 
    this.enterprise = new EnterpriseModel('','','', '', '', '', );
  }

  ngOnInit(): void {
    this.getEnterprises();
  }

getEnterprises(){
    this.enterpriseRest.getEnterprises().subscribe({
      next: (res:any)=> this.enterprises = res.enterprises,
      error: (err)=>
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
        })
    })
  }

  getEnterprise(id:string){
    this.enterpriseRest.getEnterprise(id).subscribe({
      next: (res:any)=> this.enterpriseUpdate = res.enterprise,
      error: (err)=>
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
        })
    })
  }

  updateEnterprise(){
    this.enterpriseUpdate.role = undefined;
    this.enterpriseUpdate.password = undefined;
    this.enterpriseRest.updateEnterprise(this.enterpriseUpdate._id, this.enterpriseUpdate).subscribe({
      next: (res:any)=> {
        if(res.message === 'Enterprise updated'){
          Swal.fire({
            title: res.message,
            icon: 'success',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
            });
        this.getEnterprises();
        }else{
          Swal.fire({
            title: res.message,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
            });
        }
      },
      error: (err)=>
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
        })
    })
  }

  deleteEnterprise(id:string){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.enterpriseRest.deleteEnterprise(id).subscribe({
          next:(res:any)=>{
            if(res.message === 'Enterprise deleted'){
              Swal.fire({
                title:'Deleted!',
                text:res.message,
                icon:'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
              });
              this.getEnterprises();
            }else{
              Swal.fire({
                title: res.message,
                icon: 'error',
                position: 'center',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar:true
                });
            }
          },
          error:(err)=>{
            Swal.fire({
            title: err.error.message || err.error,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
            });
          }
        });
        
      }
    })
  }

  navigate(id:string){
    if(id === this.enterpriseRest.getIdentity()._id){
      this.router.navigateByUrl('branchOffice/branchOffices');
    }else{
      this.router.navigateByUrl('branchOffice/branchOffices/'+ id );
    }
  }

}
