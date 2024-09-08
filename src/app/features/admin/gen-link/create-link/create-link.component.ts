import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { finalize } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard'

@Component({
  selector: 'app-create-link',
  templateUrl: './create-link.component.html',
  styleUrls: ['./create-link.component.css']
})
export class CreateLinkComponent {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;

  token ?: any
  regLink ?: string

  roleParam : any

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private alertService: AlertService,
      private accountService: AccountService,
      //private alertService: AlertService,
      //private regionService: RegionService
      private clipboard: Clipboard, // Inject Clipboard service
      //private shareService: ShareService // Inject Share service if using a library
  ) { }

  ngOnInit() {
      this.form = this.formBuilder.group({
          role: ['', Validators.required]
      });
  }


  createLink(form : any){
    this.accountService.createLink(form).pipe(finalize(() =>{
      console.log('this is token final ' + this.token)
      this.regLink = `http://localhost:4200/register-link/${this.token.token}/${this.token.role}`
    })).subscribe( data => {
      this.token = data
    })
  }

  copyLink() {
    if (this.regLink) {
      this.clipboard.copy(this.regLink);
      this.alertService.success('Link copied to clipboard');
    }
  }

  /* shareLink() {
    if (this.regLink) {
      this.shareService.share({ url: this.regLink, title: 'Registration Link' });
    }
  } */

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

          

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.submitting = true;

      this.createLink(this.form.value)
      this.alertService.success('Lien creer avec succées')

      this.submitting = false;
    }
}
