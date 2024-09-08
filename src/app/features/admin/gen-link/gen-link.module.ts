import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateLinkComponent } from './create-link/create-link.component';
import { GenLinkRoutingModule } from './gen-link-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CreateLinkComponent
  ],
  imports: [
    CommonModule,
    GenLinkRoutingModule,
    ReactiveFormsModule,
  ]
})
export class GenLinkModule { }
