import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Social } from '@app/_models'
import { SocialService } from '@app/_services/social.service';

@Component({templateUrl: 'add-edit-social.component.html' , styleUrls: ['add-edit-social.component.css']})
export class AddEditSocialComponent implements OnInit {

    // Form decla
    form!: FormGroup

    canceling = false

    id?: string
    title!: string
    loading = false
    submitting = false
    submitted = false
    attributType = ''
    socialId ?: any



    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        public router: Router,
        private socialService : SocialService,    
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['socialId'];

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            link: ['', Validators.required],
        });


        this.title = 'Create Social'
        if (this.id) {
            // edit mode
            
            this.title = 'Edit Social';
            this.loading = true;
            this.socialService.getSocialById(this.id)
                .pipe(first())
                .subscribe((social : Social) => {
                    this.form.patchValue({
                        title : social.title,
                        link : social.link
                    });
                    this.socialId = social._id
                    this.loading = false
                });
        }
    }

    // for calls in template
    get f() { return this.form.controls }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

       
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;

        
        // create or update course based on id param
        let saveModel;
        let message: string;
        
        if (this.id) {
            saveModel = () => this.socialService.update(this.socialId, this.form.value);
            message = 'Social updated';
        } else {
            saveModel = () => this.socialService.createSocial(this.form.value);
            message = 'Social created';
        }


        saveModel()
            .pipe(first())
            .subscribe({
                next: () => {            
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.router.navigateByUrl('admin/social');
                },
                error: (error) => {
                    this.alertService.error(error)
                    this.submitting = false
                }
            });
    }
}
