import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, RegionService } from '@app/_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-city',
  templateUrl: './add-edit-city.component.html',
  styleUrls: ['add-edit-city.component.css']
})
export class AddEditCityComponent {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    idDelegation : any
    actualDelegation ?: any
    delegations?: any[]

    canceling = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        public router: Router,
        private regionService: RegionService, 
        private alertService: AlertService,
        private location : Location
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id']

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            delegation: ['', Validators.required]
        })

        this.regionService.getDelegations()
            .pipe(first())
            .subscribe(delegations => {
                this.delegations = delegations
            })

        this.title = 'Create City'
        if (this.id) {
            // edit mode
            this.title = 'Edit City'
            this.loading = true;
            this.regionService.getCityById(this.id)
                .pipe(first())
                .subscribe(city => {
                  this.form.patchValue(city)
                  if (city.delegation){
                    this.actualDelegation = city.delegation
                    this.idDelegation = this.actualDelegation._id
                }
                  this.loading = false
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.submitting = true;

        let saveCity;
        let message: string;
        if (this.id) {
            saveCity = () => this.regionService.updateCity(this.id!, this.form.value);
            message = 'City updated';
        } else {
            saveCity = () => this.regionService.createCity(this.form.value);
            message = 'City created';
        }

        saveCity()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.location.back()
                    this.submitting= false
                },
                error: () => {
                    this.alertService.error("erreur");
                    this.submitting = false;
                }
            });
    }
}
