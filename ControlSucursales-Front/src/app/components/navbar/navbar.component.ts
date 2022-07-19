import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnterpriseRestService } from 'src/app/services/enterpriseRest/enterprise-rest.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  token:any;
  role:any;

  constructor(
    public enterpriseRest: EnterpriseRestService,
    public router:Router,
    public activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.token = this.enterpriseRest.getToken();
    this.role = this.enterpriseRest.getIdentity().role;
  }

  logOut(){
    Swal.fire({
      title: 'Log out successfully',
      icon: 'success',
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar:true
    });
    localStorage.clear();
  }
}
