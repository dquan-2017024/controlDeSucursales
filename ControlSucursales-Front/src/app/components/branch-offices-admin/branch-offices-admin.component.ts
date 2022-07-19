import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BranchOfficeModel } from 'src/app/models/branchOffice.model';
import { BranchOfficeRestService } from 'src/app/services/branchOfficeRest/branch-office-rest.service';
import { EnterpriseRestService } from 'src/app/services/enterpriseRest/enterprise-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branchoffices-admin',
  templateUrl: './branch-offices-admin.component.html',
  styleUrls: ['./branch-offices-admin.component.css']
})
export class BranchofficesAdminComponent implements OnInit {
  branchOffices:any;
  branchOfficeUpdate:any;
  branchOffice:BranchOfficeModel;
  enterprise:any;
  idEnterprise:any;

  constructor(
    private branchOfficeRest:BranchOfficeRestService,
    private enterpriseRest:EnterpriseRestService,
    private activatedRoute: ActivatedRoute

  ) {
    this.branchOffice = new BranchOfficeModel('','','','','','');
   }


  ngOnInit(): void {
   this.activatedRoute.paramMap.subscribe( idRuta=>{
     this.idEnterprise= idRuta.get('idE')
   })

    this.obtainBranchOffices(this.idEnterprise);
    this.enterpriseRest.getEnterprise(this.idEnterprise).subscribe({
      next: (res:any)=> this.enterprise = res.enterprise.name,
      error:(err)=>
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
        })
    });
    
  }

  obtainBranchOffices(id:string){
    this.branchOfficeRest.obtainBranchOffices(id).subscribe({
      next: (res:any)=> this.branchOffices = res.branchOffices,
      error: (err)=>
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
        })
    });
  }

}
