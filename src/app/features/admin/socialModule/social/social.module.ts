import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



import { SocialRoutingModule } from './social-routing.module';
import { AddEditSocialComponent } from './add-edit-social'
import { ListSocialsComponent } from './list-socials'
import { SharedModule } from '@app/shared';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SocialRoutingModule,
        FormsModule,
        SharedModule
    ],
    declarations: [
        ListSocialsComponent,
        AddEditSocialComponent
    ]
})
export class SocialModule { }