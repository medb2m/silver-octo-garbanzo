import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserFeaturesRoutingModule } from './user-features-routing.module';
import { LayoutComponent } from './layout';
import { SharedModule } from '@app/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { addReportComponent } from './add-report';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    LayoutComponent,
    addReportComponent
    
  ],
  imports: [
    CommonModule,
    UserFeaturesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ]
})
export class UserFeaturesModule { }
