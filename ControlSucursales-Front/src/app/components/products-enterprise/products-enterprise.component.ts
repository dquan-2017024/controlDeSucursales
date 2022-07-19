import { Component, OnInit } from '@angular/core';
import { ProductEnterpriseRestService } from 'src/app/services/productEnterpriseRest/product-enterprise-rest.service';
import { EnterpriseRestService } from 'src/app/services/enterpriseRest/enterprise-rest.service';
import { ProductEnterpriseModel } from 'src/app/models/productEnterprise.model';
import { ProductBranchOfficeModel } from 'src/app/models/productBranchOffice.model';
import { BranchOfficeRestService } from 'src/app/services/branchOfficeRest/branch-office-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-enterprise',
  templateUrl: './products-enterprise.component.html',
  styleUrls: ['./products-enterprise.component.css']
})

export class ProductsEnterpriseComponent implements OnInit {
  products:any;
  enterprise:string='';
  product:ProductEnterpriseModel;
  productUpdated:any;
  productBranchOffice:ProductBranchOfficeModel;
  branchOffices:any;
  search:any;
  text:any;
  searchProvider:any;

  constructor(
    private productEnterpriseRest:ProductEnterpriseRestService,
    private enterpriseRest:EnterpriseRestService,
    private branchOfficeRest:BranchOfficeRestService
  ) {
    this.product = new ProductEnterpriseModel('','','',0,'');
    this.productBranchOffice = new ProductBranchOfficeModel('','','',0,0,'','');
  }

  ngOnInit(): void {
    this.getProducts();
    this.enterprise = this.enterpriseRest.getIdentity().name;
    this.getBranchOffices();
  }
  searchName(){
    this.searchProvider=undefined;
  }

  searchProduct(){
    this.searchProvider = this.search;
    this.search=undefined;
  }

  getProducts(){
    this.productEnterpriseRest.getProducts().subscribe({
      next: (res:any)=> this.products = res.products,
      error: (err)=>
        Swal.fire({
          title: err.error.message || err.error,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        })
    });
  };

  addProduct(addProductForm:any){
    this.productEnterpriseRest.addProduct(this.product).subscribe({
      next:(res:any)=>{
        if(res.message === 'Product created successfully'){
          Swal.fire({
            title: res.message,
            icon: 'success',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
          this.getProducts();
          addProductForm.reset();
        }else{
          Swal.fire({
            title: res.message,
            icon: 'error',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
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
          timerProgressBar: true
        })
    });
  };

  getProduct(id:string){
    this.productEnterpriseRest.getProduct(id).subscribe({
      next:(res:any)=>{
        this.productUpdated = res.productEnterprise;
      },
      error:(err)=>
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    });
  };

  updateProduct(){
    this.productUpdated.enterprise = undefined;
    this.productEnterpriseRest.updateProduct(this.productUpdated._id,this.productUpdated).subscribe({
      next:(res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        })
        this.getProducts();
      },
      error: (err)=>
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    });
  };

  deleteProduct(id:string){
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
        this.productEnterpriseRest.deleteProduct(id).subscribe({
          next:(res:any)=>{
            if(res.message === 'Product deleted'){
              Swal.fire({
                title:'Deleted!',
                text:res.message,
                icon:'success',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true
              });
              this.getProducts();
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
  };
  
  distributeProducts(distributeProductsForm:any){
    this.productBranchOffice.name = this.productUpdated.name;
    this.productEnterpriseRest.distributeProducts(this.productBranchOffice).subscribe({
      next:(res:any)=>{
        if(res.message === 'Product distribute successfully'){
          Swal.fire({
            title: res.message,
            icon: 'success',
            position: 'center',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true
            });
          this.getProducts();
          distributeProductsForm.reset();
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
      error:(err)=>
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

  getBranchOffices(){
    this.branchOfficeRest.getBranchOffices().subscribe({
      next:(res:any)=>{
        this.branchOffices = res.branchOffices;
      },
      error:(err)=>
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
}
