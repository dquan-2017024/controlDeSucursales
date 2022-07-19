import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ProductBranchOfficeRestService } from 'src/app/services/productBranchOfficeRest/product-branch-office-rest.service'; 
import { BranchOfficeRestService } from 'src/app/services/branchOfficeRest/branch-office-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  branchOffice:any;
  idProduct:any;
  products:any;

  constructor(
    private productBranchOfficeRest: ProductBranchOfficeRestService,
    private branchOfficeRest: BranchOfficeRestService,
    public activatedRoute: ActivatedRoute
  ) {
   }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( idRuta=>{
      this.idProduct = idRuta.get('idB');
      this.updateGraph();
      this.getBranchOffice(this.idProduct);
    });
  }

  getBranchOffice(id:string){
    this.branchOfficeRest.getBranchOffice(id).subscribe({
      next:(res:any)=>{
        if(!res.branchOffice)
        Swal.fire({
          title: res.message,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
          })
        this.branchOffice = res.branchOffice;
      },
      error:(err)=> Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        allowOutsideClick: true,
        timer: 3000,
        timerProgressBar:true
        })
    });
  }

  updateGraph(){
    this.productBranchOfficeRest.getProducts(this.idProduct).subscribe({
      next: (res:any)=> {
        this.products = res.mostSales;
        this.pieChartData.labels = res.names;
        this.pieChartData.datasets[0].data = res.sales;
        let a = this.chart?.update();
      },

      error: (err)=> Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
        })
      
    });
  }
  
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels:[
    ] ,
    datasets: [ {
      data: [],
      backgroundColor: ['#7f43b3','#727eb7','#5faabe', '#5e549f','#3c6c79','#3b50b3']
    } ]
  };
 
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels:{color: 'white', boxHeight:15,boxWidth:52,font: {size:16}},
        
      
      },
      
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  
  public pieChartType: ChartType = 'pie';
}
