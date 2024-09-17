import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountsRoutingModule,
        RecaptchaModule
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
    ]
})
export class AccountsModule { }