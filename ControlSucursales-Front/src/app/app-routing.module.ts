import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { BranchOfficeComponent } from './components/branch-office/branch-office.component';
import { ProductsEnterpriseComponent } from './components/products-enterprise/products-enterprise.component';
import { EnterpriseComponent } from './components/enterprise/enterprise.component';
import { BranchOfficesComponent } from './components/branch-offices/branch-offices.component';
import { ProductsBranchOfficeComponent } from './components/products-branch-office/products-branch-office.component';
import { EnterprisesComponent } from './components/enterprises/enterprises.component';
import { BranchofficesAdminComponent } from './components/branch-offices-admin/branch-offices-admin.component';
import { GraphComponent } from './components/graph/graph.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', canActivate:[AdminGuard], component: RegisterComponent},
  {path: 'branchOffice', canActivate:[UserGuard],component: BranchOfficeComponent, children:[
    {path: 'branchOffices', component: BranchOfficesComponent},
    {path: 'productsBranchOffice/:idB', component: ProductsBranchOfficeComponent},
    {path: 'graph/:idB', component: GraphComponent},
    {path: 'branchOffices/:idE', component: BranchofficesAdminComponent}
  ]},
  {path: 'enterprise', canActivate:[UserGuard], component:EnterpriseComponent, children:[
    {path: 'enterprises', canActivate:[AdminGuard], component:EnterprisesComponent},
    {path: 'productsEnterprise', component: ProductsEnterpriseComponent}
  ]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
