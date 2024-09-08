import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCitiesComponent } from './list-cities';
import { AddEditCityComponent } from './add-edit-city';



const routes: Routes = [
  { path: '', component: ListCitiesComponent },
  { path: 'add', component: AddEditCityComponent },
  { path: 'edit/:id', component: AddEditCityComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitiesRoutingModule { }
