import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@app/_services';
import { ReportService } from '@app/_services/report.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class addReportComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;

  selectedFiles: File[] = [];
  selectedImages: string[] = [];

  constructor(private fb: FormBuilder, private reportService: ReportService, private alert : AlertService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      content: ['', Validators.required],
      machaghel: ['', Validators.required],
      machakel_alyawm: ['', Validators.required],
      houloul: ['', Validators.required],
      concurence: [false, Validators.required],
      concurrenceDetails: [''],
      propositions: ['', Validators.required],
      images: [null]
    });

    // Subscribe to changes on the concurence checkbox
    this.form.get('concurence')?.valueChanges.subscribe(checked => {
      console.log('checked is '+ checked)
      if (!checked) {
        this.form.get('concurrenceDetails')?.reset();
      }
    });
  }

  get f() { return this.form.controls; }

    onFileChange(event: any) {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.selectedFiles = Array.from(files);
        this.selectedImages = [];
  
        this.selectedFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.selectedImages.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    }

    triggerFileInput() {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      fileInput.click();
    }
    
    

    removeImage(index: number) {
      this.selectedFiles.splice(index, 1);
      this.selectedImages.splice(index, 1);
    }


    onImageClick(index: number) {
      //return URL.createObjectURL(file);
      // Logic to handle image click, like opening a modal for a larger view
      console.log(`Image at index ${index} clicked`);
    }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    const formData = new FormData();
    const content = this.form.get('content')?.value ?? ''

    formData.append('content', content);
    formData.append('machaghel', this.form.get('machaghel')?.value ?? '');
    formData.append('machakel_alyawm', this.form.get('machakel_alyawm')?.value ?? '');
    formData.append('houloul', this.form.get('houloul')?.value ?? '');
    formData.append('concurence', this.form.get('concurence')?.value ?? false);
    formData.append('concurrenceDetails', this.form.get('concurrenceDetails')?.value ?? '');
    formData.append('propositions', this.form.get('propositions')?.value ?? '');
    // selected files
    this.selectedFiles.forEach((file, index) => {
      formData.append('images', file);
    });

    this.reportService.createReport(formData).subscribe(
      response => {
        // Reset form and other relevant variables after successful submission
        this.form.reset(); // Reset the form
        this.selectedFiles = []; // Clear selected files
        this.selectedImages = []; // Clear image previews
        this.submitted = false; // Reset the submitted state
        this.loading = false; // Stop the loading state
        this.alert.success('report submitted with success')
      },
      error => {
        console.error('Error creating report', error);
        this.alert.error('Error when submitting report')
        this.loading = false;
      }
    );
  }
  
}
