import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@core/helpers';

@Component({ templateUrl: 'update.component.html' , styleUrls: ['update.component.css'] })
export class UpdateComponent implements OnInit {
    account = this.accountService.accountValue!;
    form!: FormGroup;
    submitting = false;
    submitted = false;
    deleting = false;

    selectedFile: File | null = null;
    previewUrl: string | ArrayBuffer | null | undefined = null;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            fullName: [this.account.fullName, Validators.required],
            username: [this.account.username, Validators.required],
            cin: [this.account.cin, Validators.required],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: [''],
            image: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
        this.previewUrl = this.account.image
    }

   


    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }


    // Handle file selection and generate preview
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this.selectedFile = file; // Save the selected file for later upload
    }
  }

  // Trigger the hidden file input
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

    onSubmit() {
        console.log('hello')
        this.submitted = true;
        console.log('hello2')
        // reset alerts on submit
        this.alertService.clear();
        console.log('hello3')

        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('hello4')
            return;
        }
        console.log('hello5')

        this.submitting = true;

        console.log('hello')

        // create formDATA
        const formData = new FormData()
        formData.append('username', this.form.get('username')?.value)
        formData.append('fullName', this.form.get('fullName')?.value)
        formData.append('cin', this.form.get('cin')?.value)
        if (this.form.get('password')?.value){
            formData.append('password', this.form.get('password')?.value);
            formData.append('confirmPassword', this.form.get('confirmPassword')?.value);
        }

        if (this.selectedFile) {
            formData.append('image', this.selectedFile);
        }
        console.log('hello fill form')

        this.accountService.update(this.account.id!, formData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
            console.log('hello account service update ')
    }
    // Not needed now 
    /* onDelete() {
        if (confirm('Are you sure?')) {
            this.deleting = true;
            this.accountService.delete(this.account.id!)
                .pipe(first())
                .subscribe(() => {
                    this.alertService.success('Account deleted successfully', { keepAfterRouteChange: true });
                });
        }
    } */
    
}