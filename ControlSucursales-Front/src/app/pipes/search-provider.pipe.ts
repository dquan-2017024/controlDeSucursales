import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchProvider'
})
export class SearchProviderPipe implements PipeTransform {

  transform(products:any, searchProvider:any){
    if(searchProvider == undefined){
      return products;
    }else{
      return products.filter( (product:any) => {
        return product.provider.toLowerCase().includes(searchProvider.toLowerCase())
      })
    }
  }

}
