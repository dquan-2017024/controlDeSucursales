import { Component, OnInit } from '@angular/core';
import { ProductBranchOfficeModel } from 'src/app/models/productBranchOffice.model';
import { ProductBranchOfficeRestService } from 'src/app/services/productBranchOfficeRest/product-branch-office-rest.service';
import { ActivatedRoute } from '@angular/router';
import { BranchOfficeRestService } from 'src/app/services/branchOfficeRest/branch-office-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-branch-office',
  templateUrl: './products-branch-office.component.html',
  styleUrls: ['./products-branch-office.component.css']
})
export class ProductsBranchOfficeComponent implements OnInit {
  idProduct:any;
  products:any;
  productBuy:any;
  productBranchOffice:ProductBranchOfficeModel;
  search:any;
  searchProvider:any;
  branchOffice:any;

  constructor(
    private productBranchOfficeRest:ProductBranchOfficeRestService,
    private branchOfficeRest:BranchOfficeRestService,
    private activatedRoute: ActivatedRoute

  ) {
    this.productBranchOffice = new ProductBranchOfficeModel('','','',0,0,'','');
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( idRuta=>{
      this.idProduct = idRuta.get('idB');
    });
    this.getProducts(this.idProduct);
    this.getBranchOffice(this.idProduct);
  }

  searchName(){
    this.searchProvider=undefined;
  }

  searchProduct(){
    this.searchProvider = this.search;
    this.search=undefined;
  }

  getProducts(id:string){
    this.productBranchOfficeRest.getProducts(id).subscribe({
      next: (res:any)=>this.products = res.mostSales,
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
  };

  orderProducts(id:string){
    this.productBranchOfficeRest.orderProducts(id).subscribe({
      next: (res:any)=>this.products = res.lessSales,
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
  };

  getBranchOffice(id:string){
    this.branchOfficeRest.getBranchOffice(id).subscribe({
      next: (res:any)=> {
      if(!res.branchOffice){
        Swal.fire({
          title: res.message,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
          })
      }
      this.branchOffice = res.branchOffice.name;
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
  };


  getProduct(id:string){
    this.productBranchOfficeRest.getProduct(id).subscribe({
      next:(res:any)=>{
        if(!res.productBranchOffice)
        Swal.fire({
          title: res.message,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
          });
        this.productBuy = res.productBranchOffice;
      },
      error:(err)=>{
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
  };

  sellProduct(){
    this.productBuy.branchOffice = this.productBuy.branchOffice._id; 
    this.productBuy.quantity = this.productBranchOffice.stock;
    
    this.productBranchOfficeRest.sellProduct(this.productBuy).subscribe({
      next:(res:any)=>{
        if(res.message === 'Product selling successfully'){
          Swal.fire({
            title: res.message,
            icon: 'success',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
          })
          this.getProducts(this.idProduct);
          this.productBranchOffice.stock = 0;
        }else{
          Swal.fire({
            title: res.message,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
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
          timerProgressBar: true
          })
      }
    });
  }
}
