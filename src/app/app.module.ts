import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';



import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from '@core/interceptors';
import { AccountService } from '@app/_services';
import { appInitializer } from '@core/helpers';
import { AppComponent } from './app.component';
import { HomeComponent } from '@features/home';
import { SharedModule } from '@shared/shared.module';
import { AddLinkComponent } from './add-link/add-link.component'
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        SharedModule,
        RecaptchaModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        AddLinkComponent,
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }