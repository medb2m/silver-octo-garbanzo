import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, RegionService } from '@app/_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-delegation',
  templateUrl: './add-edit-delegation.component.html',
  styleUrls: ['add-edit-delegation.component.css']
})
export class AddEditDelegationComponent {
  form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    idRegion : any
    actualRegion ?: any
    regions?: any[]

    canceling = false

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
            region: ['', Validators.required]
        })

        this.regionService.getAll()
            .pipe(first())
            .subscribe(regions => {
                this.regions = regions
            })

        this.title = 'Create Delegation'
        if (this.id) {
            // edit mode
            this.title = 'Edit Delegation'
            this.loading = true;
            this.regionService.getDelegationById(this.id)
                .pipe(first())
                .subscribe(delegation => {
                  this.form.patchValue(delegation)
                  if (delegation.region){
                    this.actualRegion = delegation.region
                    this.idRegion = this.actualRegion._id
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

        let saveDelegation;
        let message: string;
        if (this.id) {
            saveDelegation = () => this.regionService.updateDelegation(this.id!, this.form.value);
            message = 'Delegation updated';
        } else {
            saveDelegation = () => this.regionService.createDelegation(this.form.value);
            message = 'Delegation created';
        }

        saveDelegation()
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
