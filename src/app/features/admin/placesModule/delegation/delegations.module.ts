import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { DelegationsRoutingModule } from './delegations-routing.module';
import { AddEditDelegationComponent } from './add-edit-delegation';
import { ListDelegationsComponent } from './list-delegations';


@NgModule({
  declarations: [
    AddEditDelegationComponent,
    ListDelegationsComponent
  ],
  imports: [
    CommonModule,
    DelegationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DelegationsModule { }
