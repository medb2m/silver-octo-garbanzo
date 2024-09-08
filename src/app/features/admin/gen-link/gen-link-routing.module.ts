import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateLinkComponent } from './create-link/create-link.component';



const routes: Routes = [

    { path : '' , component : CreateLinkComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenLinkRoutingModule { }
