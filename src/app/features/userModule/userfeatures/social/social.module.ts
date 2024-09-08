import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialRoutingModule } from './social-routing.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { LayoutComponent } from './layout';
import { SharedModule } from '@app/shared';



@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    LayoutComponent,
  
    
  ],
  imports: [
    CommonModule,
    SocialRoutingModule,
    SharedModule
  ]
})
export class SocialModule { }
