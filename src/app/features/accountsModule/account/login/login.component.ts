import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { TranslateService } from '@ngx-translate/core';

@Component({ templateUrl: 'login.component.html', styleUrls: ['login.component.css'] })
export class LoginComponent implements OnInit {
    form!: FormGroup;
    submitting = false;
    submitted = false;
    showPassword: boolean = false;

    currentLanguageFlag: string = 'assets/flags/ar.png'


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            //recaptcha: ['', Validators.required]
        });
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
    
    changeLanguage(lang: string) {
        this.translate.use(lang);
        this.updateFlagIcon(lang);
    }

    private updateFlagIcon(lang: string) {
        switch (lang) {
          case 'fr':
            this.currentLanguageFlag = 'assets/flags/fr.png';
            break;
          case 'en':
            this.currentLanguageFlag = 'assets/flags/en.png';
            break;
          default:
            this.currentLanguageFlag = 'assets/flags/ar.png';
            break;
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        console.log('enter submit')
        this.submitted = true;


        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        console.log('form valid')

        this.submitting = true;
        this.accountService.login(this.f['username'].value, this.f['password'].value)
            .pipe(first())
            .subscribe({
                next: (account) => {
                    if (account.role === 'Admin'){
                        //console.log('the user is an admin')
                        this.router.navigateByUrl('/admin/dashboard');
                    } else {
                        this.router.navigateByUrl('/work/report/add');
                    }
                    // get return url from query parameters or default to home page
                    //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    //this.router.navigateByUrl(returnUrl);
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}