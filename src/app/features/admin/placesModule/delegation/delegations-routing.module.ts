import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDelegationsComponent } from './list-delegations';
import { AddEditDelegationComponent } from './add-edit-delegation';



const routes: Routes = [
  { path: '', component: ListDelegationsComponent },
  { path: 'add', component: AddEditDelegationComponent },
  { path: 'edit/:id', component: AddEditDelegationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegationsRoutingModule { }
