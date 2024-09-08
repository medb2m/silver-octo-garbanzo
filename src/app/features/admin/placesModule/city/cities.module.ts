import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { CitiesRoutingModule } from './cities-routing.module';
import { AddEditCityComponent } from './add-edit-city';
import { ListCitiesComponent } from './list-cities';


@NgModule({
  declarations: [
    AddEditCityComponent,
    ListCitiesComponent
  ],
  imports: [
    CommonModule,
    CitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CitiesModule { }
