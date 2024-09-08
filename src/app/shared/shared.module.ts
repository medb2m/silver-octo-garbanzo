import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from './pipes/search.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AlertComponent, FooterComponent, NavbarComponent } from './components';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb';
import { BackButtonComponent } from './components/back-button';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AlertComponent,
    NavbarComponent,
    FooterComponent,
    BreadcrumbComponent,
    SearchPipe,
    TruncatePipe,
    BackButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    AlertComponent,
    NavbarComponent,
    FooterComponent,
    BreadcrumbComponent,
    SearchPipe,
    TruncatePipe,
    BackButtonComponent,
    NgxPaginationModule,
    TranslateModule
  ]
})
export class SharedModule { }
