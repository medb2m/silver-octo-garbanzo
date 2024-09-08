import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, RegionService } from '@app/_services';
import { MustMatch } from '@core/helpers';

@Component({ templateUrl: 'add-edit.component.html' , styleUrls: ['add-edit.component.css'] })
export class AddEditComponent implements OnInit {
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
    actualCityName ?: any

    changeCity = false

    changecity(){
        this.changeCity = true
    }

    // Zone
    idReg : any
    regions?: any[]
    actualReg ?: any

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private regionService: RegionService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
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
        if (this.id) {
            // edit mode
            this.title = 'Edit Account';
            this.loading = true;
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    if (x.role === 'User'){
                        this.showUserField = true;
                        this.actualCity = x.city._id
                        this.actualCityName = x.city.name
                        console.log('this is the actualCity ' + x.city.name)
                        //this.idCity = this.actualCity._id
                    }
                    if (x.role === 'Moderator'){
                        this.showModeratorField = true;
                        this.actualReg = x.moderatorZone
                        console.log('this is the actualReg ' + x.moderatorZone)
                        //this.idReg = this.actualReg._id
                    }
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

        

            setRoleForm (param : string){
                if (param === 'admin'){
                    return 'Admin'
                } else if (param === 'moderator'){
                    return 'Moderator'
                } else {
                    return 'User'
                }
            }
            updateFormForRole(role: string) {
                if (role === 'moderator' ){
                    this.showModeratorField = true
                } else if (role === 'user') {
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

        // create or update account based on id param
        const saveAccount = this.id
            ? () => this.accountService.update(this.id!, this.form.value)
            : () => this.accountService.create(this.form.value);
        const message = this.id ? 'Account updated' : 'Account created';

        saveAccount()
            .pipe(first())
            .subscribe({
                next: (x) => {
                    //console.log('this x id '+ x.id)
                    const cityId = this.form.get('city')?.value;
                    const role = this.form.get('role')?.value;
                    if (role !== 'Moderator'){
                        if(this.id ){
                            if (cityId !== this.actualCity){
                                this.regionService.removeWorker(this.actualCity, this.id).subscribe()
                            console.log('worker disassosiated from old city' +this.actualCity)
                            this.regionService.addWorker(cityId, this.id).subscribe()
                            console.log('worker assosiated to new city ' + cityId)
                            }
                            console.log('enter the if but doesnt change value if only this log')
                        } else {
                            
                            const workerId = x.id
                            //console.log('the city value ' + cityValue)
                            this.regionService.addWorker(cityId, workerId).subscribe()
                            console.log('worker assosiated')
                        }
                    }
                    
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/admin/accounts');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}