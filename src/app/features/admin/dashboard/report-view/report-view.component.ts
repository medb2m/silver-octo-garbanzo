import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Report } from "@app/_models";
import { ReportService } from "@app/_services/report.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { finalize } from 'rxjs';
import { ExitConfirmComponent } from "./exit-confirm.component";


@Component({
    selector: 'app-report-view',
    templateUrl: './report-view.component.html',
    styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnDestroy {
    report!: Report
    selectedImage: string | null = null;

    @ViewChild('reportContent') reportContent!: ElementRef;

    constructor(
        private reportService: ReportService,
        private route: ActivatedRoute,
        private modalService: NgbModal
    ){}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id')
        if (id) {
            this.reportService.getReportById(id).subscribe(data => {
                this.report = data 
            })
        }
    }

    traite(id :string) {
        this.reportService.traiteReport(id).subscribe((report)=>{
            this.report.traiter = report.traiter
        })
    }

    exportReportToPDF() {
        const doc = new jsPDF('p', 'pt', 'a4');
        const content = this.reportContent.nativeElement;
    
        html2canvas(content).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
          doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          doc.save('report.pdf');
        });
      }

      ngOnDestroy(){
        if (!this.report.traiter) {
            // Open the modal dialog for confirmation
            const modalRef = this.modalService.open(ExitConfirmComponent);
            modalRef.componentInstance.isTreated = this.report.traiter;  // Pass data to the modal
      
            // Handle the result of the confirmation modal
            modalRef.result.then((shouldMarkAsTreated: boolean) => {
              if (shouldMarkAsTreated) {
                this.traite(this.report._id);  // Mark the report as treated
              }
            }).catch(() => {
              // User dismissed the modal without taking action
              // No further action needed here
            });
          }
      }  
}