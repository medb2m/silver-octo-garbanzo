import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Report } from "@app/_models";
import { ReportService } from "@app/_services/report.service";
import { finalize } from 'rxjs';


@Component({
    selector: 'app-report-view',
    templateUrl: './report-view.component.html',
    styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent {
    report!: Report
    selectedImage: string | null = null;

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
}