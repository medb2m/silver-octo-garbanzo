import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { ListRegionsComponent } from './list-regions';
import { AddEditRegionComponent } from './add-edit-region';
import { RegionsRoutingModule } from './regions-routing.module';


@NgModule({
  declarations: [
    AddEditRegionComponent,
    ListRegionsComponent
  ],
  imports: [
    CommonModule,
    RegionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RegionsModule { }
