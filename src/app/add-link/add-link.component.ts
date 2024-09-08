import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService, RegionService } from '@app/_services';
import { MustMatch } from '@app/core';
import { first } from 'rxjs';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.css']
})
export class AddLinkComponent {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;

  showUserField = false
  showModeratorField = false

  roleParam : any

  // city
  idCity : any
  cities?: any[] 
  actualCity ?: any

  // Zone
  idReg : any
  regions?: any[]
  actualReg ?: any
  token!: any

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private accountService: AccountService,
      private alertService: AlertService,
      private regionService: RegionService
  ) { }

  ngOnInit() {
      this.token = this.route.snapshot.params['token'];
      this.roleParam = this.route.snapshot.paramMap.get('role');
      
      this.regionService.getCities().subscribe( cities => this.cities = cities)
      
      this.regionService.getAll().subscribe(x => this.regions = x)
      

      this.form = this.formBuilder.group({
          fullName: ['', Validators.required],
          username: ['', Validators.required],
          cin: ['', [Validators.required]],
          role: [this.setRoleForm(this.roleParam )|| '', Validators.required],
          moderatorZone: [''],
          city: [''],
          // password only required in add mode
          password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]],
          confirmPassword: ['']
      }, {
          validator: MustMatch('password', 'confirmPassword')
      });

      if (this.roleParam) {
          console.log(' if role')
          this.updateFormForRole(this.roleParam);
      }

      this.title = 'Create Account';
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

      

          setRoleForm (param : string){
              if (param === 'Admin'){
                  return 'Admin'
              } else if (param === 'Moderator'){
                  return 'Moderator'
              } else {
                  return 'User'
              }
          }
          updateFormForRole(role: string) {
              if (role === 'Moderator' ){
                  this.showModeratorField = true
              } else if (role === 'User') {
                  this.showUserField = true
              }
      
              if (this.showModeratorField) {
                  this.form.controls['moderatorZone'].setValidators([Validators.required]);
                  this.form.controls['city'].clearValidators();
                  this.form.controls['city'].reset();
              } else if (this.showUserField) {
                  this.form.controls['city'].setValidators([Validators.required]);
                  this.form.controls['moderatorZone'].clearValidators();
                  this.form.controls['moderatorZone'].reset();
              } else {
                  this.form.controls['moderatorZone'].clearValidators();
                  this.form.controls['city'].clearValidators();
                  this.form.controls['moderatorZone'].reset();
                  this.form.controls['city'].reset();
              }
      
              this.form.controls['moderatorZone'].updateValueAndValidity();
              this.form.controls['city'].updateValueAndValidity();
          }
          

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.submitting = true;

      const saveAccount = () => this.accountService.createAccount(this.form.value, this.token);
      const message = 'Account created';

      saveAccount()
          .pipe(first())
          .subscribe({
              next: () => {
                // Add association
                  this.alertService.success(message, { keepAfterRouteChange: true });
                  this.router.navigateByUrl('/account/login');
              },
              error: error => {
                  this.alertService.error(error);
                  this.submitting = false;
              }
          });
  }
}
