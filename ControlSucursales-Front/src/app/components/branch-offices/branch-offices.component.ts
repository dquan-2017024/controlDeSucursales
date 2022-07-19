import { Component, OnInit } from '@angular/core';
import { BranchOfficeModel } from 'src/app/models/branchOffice.model';
import { BranchOfficeRestService } from 'src/app/services/branchOfficeRest/branch-office-rest.service';
import { EnterpriseRestService } from 'src/app/services/enterpriseRest/enterprise-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch-offices',
  templateUrl: './branch-offices.component.html',
  styleUrls: ['./branch-offices.component.css']
})
export class BranchOfficesComponent implements OnInit {
  search:any;
  branchOffices:any;
  branchOfficeUpdate:any;
  branchOffice:BranchOfficeModel;
  enterprise:any;
  response:any;


  constructor(
    private branchOfficeRest:BranchOfficeRestService,
    private enterpriseRest:EnterpriseRestService,
  ) {
    this.branchOffice = new BranchOfficeModel('','','','','','');
   }

  ngOnInit(): void {
    this.getBranchOffices();
    this.enterprise = this.enterpriseRest.getIdentity().name;
  }

  getBranchOffices(){
    this.branchOfficeRest.getBranchOffices().subscribe({
      next: (res:any)=>{
        this.branchOffices = res.branchOffices
      },
      error: (err)=>{
        Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
        })
      }
    });
  }

  getBranchOffice(id:string){
    this.branchOfficeRest.getBranchOffice(id).subscribe({
      next:(res:any)=>{
        if(!res.branchOffice){
          Swal.fire({
            title: res.message,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            timer: 3000
            })
        }
        this.branchOfficeUpdate = res.branchOffice;
      },
      error: (err)=>{ 
        Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000
        })
      }
    });
  }

  createBranchOffice(createBranchForm:any){
    this.branchOfficeRest.createBranchOffice(this.branchOffice).subscribe({
      next:(res:any)=>{
        
        if(res.message === 'BranchOffice created successfully'){
          Swal.fire({
            title: res.message,
            icon: 'success',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
          });
        this.getBranchOffices();
        createBranchForm.reset();
        }else{
          Swal.fire({
            title: res.message,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            allowOutsideClick: true,
            timer: 3000,
            timerProgressBar:true

          })
        }
      },
      error: (err)=>{
        Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        allowOutsideClick: true,
        timer: 3000,
        timerProgressBar:true
        });
      }
    });
    
  }

  deleteBranchOffice(id:string){
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
        this.branchOfficeRest.deleteBranchOffice(id).subscribe({
          next:(res:any)=>{
            if(res.message === 'BranchOffice deleted'){
              Swal.fire({
                title:'Deleted!',
                text:res.message,
                icon:'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
              });
              this.getBranchOffices();
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

  updateBranchOffice(){
    this.branchOfficeUpdate.enterprise=undefined;
    this.branchOfficeRest.updateBranchOffice(this.branchOfficeUpdate._id, this.branchOfficeUpdate ).subscribe({
      next:(res:any)=>{
        if(res.message === 'BranchOffice updated'){
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        });
        this.getBranchOffices();
      }else{
        Swal.fire({
          title: res.message,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        })
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
        })
      }
    });
  }
}
