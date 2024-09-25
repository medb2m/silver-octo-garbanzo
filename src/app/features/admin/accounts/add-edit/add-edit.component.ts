import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, RegionService } from '@app/_services';
import { MustMatch } from '@core/helpers';
import jsPDF from 'jspdf';

@Component({ templateUrl: 'add-edit.component.html', styleUrls: ['add-edit.component.css'] })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    showUserField = false
    showModeratorField = false

    roleParam: any

    // city
    idCity: any
    cities?: any[]
    actualCity?: any
    actualCityName?: any
    selectedRegion?: any
    selectedDelegation?: any

    changeCity = false

    actualModeratorZone: string = ""

    changecity() {
        this.changeCity = true
    }

    // Zone
    idReg: any
    regions?: any[]
    actualReg?: any

    delegations?: any[]

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

        this.regionService.getCities().subscribe(cities => this.cities = cities)

        this.regionService.getAll().subscribe(x => this.regions = x)

        this.regionService.getDelegations().subscribe(x => this.delegations = x)


        this.form = this.formBuilder.group({
            fullName: ['', Validators.required],
            username: ['', Validators.required],
            cin: ['', [Validators.required]],
            role: [this.setRoleForm(this.roleParam) || '', Validators.required],
            moderatorRegion: [''],
            moderatorDelegation: [''],
            city: [''],
            // password only required in add mode
            password: [''],
            confirmPassword: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });

        this.route.queryParams.subscribe(params => {
            if (params['cityId']) {
                console.log('query ' + params['cityId'])
                this.actualCity = this.cities?.find(city => city._id === params['cityId']);
                this.form.patchValue({ city: params['cityId'] });
            } else if (params['regionId']) {
                console.log('query = ' + params['regionId'])
                this.selectedRegion = this.regions?.find(region => region._id === params['regionId']);
                this.form.patchValue({ moderatorRegion: params['regionId'] });
            } else if (params['delegationId']){
                this.selectedDelegation = this.delegations?.find(delegation => delegation._id === params['delegationId']);
                this.form.patchValue({ moderatorDelegation: params['delegationId'] });
            }
        });

        if (this.roleParam) {
            console.log(' if role ' + this.roleParam)
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
                    if (x.role === 'User') {
                        this.showUserField = true;
                        this.actualCity = x.city._id
                        this.actualCityName = x.city.name
                        console.log('this is the actualCity ' + x.city.name)
                        //this.idCity = this.actualCity._id
                    }
                    this.loading = false;
                });
        }
    }


    exportUserToPDF() {
        const doc = new jsPDF();

        // Get user information from the form
        const fullName = this.form.get('fullName')?.value || 'N/A';
        const username = this.form.get('username')?.value || 'N/A';
        const cin = this.form.get('cin')?.value || 'N/A';
        const role = this.form.get('role')?.value || 'N/A';
        const city = this.actualCityName || 'N/A';
        const moderatorZone = this.actualReg || 'N/A';

        // Assume `profilePicture` is the base64 or URL of the user's profile picture
        const profilePicture = this.form.get('profilePicture')?.value;  // Adjust this according to where you store the profile picture

        // Add user data to the PDF
        doc.text('User Information', 20, 20);
        doc.text(`Full Name: ${fullName}`, 20, 40);
        doc.text(`Username: ${username}`, 20, 60);
        doc.text(`CIN: ${cin}`, 20, 80);
        doc.text(`Role: ${role}`, 20, 100);
        if (role === 'User') {
            doc.text(`City: ${city}`, 20, 120);
        }
        if (role === 'Moderator') {
            doc.text(`Moderator Zone: ${moderatorZone}`, 20, 140);
        }

        // Add profile picture if it exists
        if (profilePicture) {
            const imageWidth = 50;  // Set image width
            const imageHeight = 50; // Set image height
            const imageX = 150;      // X position for image
            const imageY = 20;       // Y position for image

            // If the profile picture is a base64 string
            if (profilePicture.startsWith('data:image/')) {
                doc.addImage(profilePicture, 'PNG', imageX, imageY, imageWidth, imageHeight);
            } else {
                // If the profile picture is a URL, fetch it and convert to base64
                this.convertImageToBase64(profilePicture).then((base64Image: string) => {
                    doc.addImage(base64Image, 'PNG', imageX, imageY, imageWidth, imageHeight);
                    // Save the PDF with the image
                    doc.save(`${fullName}_UserInfo.pdf`);
                }).catch(error => {
                    console.error('Error fetching the image: ', error);
                    doc.save(`${fullName}_UserInfo.pdf`);
                });
            }
        } else {
            // If no profile picture, save the PDF directly
            doc.save(`${fullName}_UserInfo.pdf`);
        }
    }

    // Helper method to convert image URL to base64
    convertImageToBase64(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/png');
                    resolve(dataURL);
                } else {
                    reject('Canvas context not available');
                }
            };
            img.onerror = reject;
        });
    }


    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }



    setRoleForm(param: string) {
        if (param === 'admin') {
            return 'Admin'
        } else if (param === 'regmod') {
            console.log('return moderatorRegion & ' + this.selectedRegion)
            //this.form.patchValue({moderatorRegion : this.selectedRegion})
            return 'ModeratorRegion'
        } else if (param === 'delmod') {
            return 'ModeratorDelegation'
        } else {
            return 'User'
        }
    }
    showModeratorRegionField: boolean = false
    showModeratorDelegationField: boolean = false
    /* updateFormForRole(role: string) {
        if (role === 'moderator') {
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
    } */
    updateFormForRole(role: string) {
        if (role === 'ModeratorRegion') {
            this.showModeratorRegionField = true;
            this.showModeratorDelegationField = false;
            this.form.controls['moderatorRegion'].setValidators([Validators.required]);
            this.form.controls['moderatorDelegation'].clearValidators();
            this.form.controls['moderatorDelegation'].reset();
        } else if (role === 'ModeratorDelegation') {
            this.showModeratorRegionField = false;
            this.showModeratorDelegationField = true;
            this.form.controls['moderatorDelegation'].setValidators([Validators.required]);
            this.form.controls['moderatorRegion'].clearValidators();
            this.form.controls['moderatorRegion'].reset();
        } else if (role === 'User') {
            this.showUserField = true;
        }
    }

    onSubmit() {
        console.log('hello')
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        console.log('hello')

        this.submitting = true;
        //this.form.setValue({ password: this.form.get('cin')?.value, confirmPassword: this.form.get('cin')?.value})
        // Automatically set CIN as password if creating a new account (no id present)
        if (!this.id) {
            const cinValue = this.form.get('cin')?.value;
            this.form.patchValue({
                password: cinValue,
                confirmPassword: cinValue
            });
        }

        // Handle empty fields: if empty, set to null
        const formValue = this.form.value;

        if (!formValue.city || formValue.city === '') {
            formValue.city = null;
        }

        if (!formValue.moderatorRegion || formValue.moderatorRegion === '') {
            formValue.moderatorRegion = null;
        }

        if (!formValue.moderatorDelegation || formValue.moderatorDelegation === '') {
            formValue.moderatorDelegation = null;
        }

        // create or update account based on id param
        const saveAccount = this.id
            ? () => this.accountService.update(this.id!, this.form.value)
            : () => this.accountService.create(this.form.value);
        const message = this.id ? 'Account updated' : 'Account created';


        saveAccount()
            .pipe(first())
            .subscribe({
                next: (x) => {
                    const cityId = this.form.get('city')?.value;
                    const role = this.form.get('role')?.value;
                    const moderatorZone = this.form.get('moderatorZone')?.value;

                    if (role === 'Moderator') {
                        if (this.id) {
                            // Updating an existing moderator
                            if (moderatorZone !== this.actualModeratorZone) {
                                // If moderator's region has changed
                                this.regionService.removeModerator(this.actualModeratorZone, this.id).subscribe(() => {
                                    console.log('Moderator disassociated from old region: ' + this.actualModeratorZone);
                                });
                                this.regionService.addModerator(moderatorZone, this.id).subscribe(() => {
                                    console.log('Moderator associated with new region: ' + moderatorZone);
                                });
                            }
                        } else {
                            // Creating a new moderator
                            const moderatorId = x.id;
                            this.regionService.addModerator(moderatorZone, moderatorId).subscribe(() => {
                                console.log('Moderator associated with region: ' + moderatorZone);
                            });
                        }
                    } else if (role !== 'Moderator') {
                        // Logic for non-moderator roles (similar to your existing logic)
                        if (this.id) {
                            if (cityId !== this.actualCity) {
                                this.regionService.removeWorker(this.actualCity, this.id).subscribe(() => {
                                    console.log('Worker disassociated from old city: ' + this.actualCity);
                                });
                                this.regionService.addWorker(cityId, this.id).subscribe(() => {
                                    console.log('Worker associated with new city: ' + cityId);
                                });
                            }
                        } else {
                            const workerId = x.id;
                            this.regionService.addWorker(cityId, workerId).subscribe(() => {
                                console.log('Worker associated with city: ' + cityId);
                            });
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