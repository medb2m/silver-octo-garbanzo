import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRegionsComponent } from './list-regions';
import { AddEditRegionComponent } from './add-edit-region';



const routes: Routes = [
  { path: '', component: ListRegionsComponent },
  { path: 'add', component: AddEditRegionComponent },
  { path: 'edit/:id', component: AddEditRegionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionsRoutingModule { }
