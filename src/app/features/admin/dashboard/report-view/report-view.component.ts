import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Report } from "@app/_models";
import { ReportService } from "@app/_services/report.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { finalize } from 'rxjs';


@Component({
    selector: 'app-report-view',
    templateUrl: './report-view.component.html',
    styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent {
    report!: Report
    selectedImage: string | null = null;

    @ViewChild('reportContent') reportContent!: ElementRef;

    constructor(
        private reportService: ReportService,
        private route: ActivatedRoute,
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
            console.log('sent from here check there')
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
}