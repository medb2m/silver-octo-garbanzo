import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, RegionService } from '@app/_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-region',
  templateUrl: './add-edit-region.component.html',
  styleUrls: ['add-edit-region.component.css']
})
export class AddEditRegionComponent {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    canceling = false
  
    constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private regionService: RegionService,
      private alertService: AlertService,
      private location: Location
    ) {}
  
    ngOnInit() {
      this.id = this.route.snapshot.params['id'];
  
      this.form = this.formBuilder.group({
        name: ['', Validators.required],
      });
  
      this.title = 'Create Region';
      if (this.id) {
        // edit mode
        this.title = 'Edit Region';
        this.loading = true;
        this.regionService.getById(this.id)
          .pipe(first())
          .subscribe(region => {
            this.form.patchValue(region);
            this.loading = false;
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
  
      let saveRegion;
      let message: string;
      if (this.id) {
        saveRegion = () => this.regionService.update(this.id!, this.form.value);
        message = 'Region updated';
      } else {
        saveRegion = () => this.regionService.create(this.form.value);
        message = 'Region created';
      }
  
      saveRegion()
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success(message, { keepAfterRouteChange: true });
            this.location.back();
            this.submitting = false;
          },
          error: () => {
            this.alertService.error("Error");
            this.submitting = false;
          }
        });
    }
  
}
