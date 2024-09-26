import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { ReportListComponent } from './report-list/report-list.component';
import { TunMapComponent } from './tun-map/tun-map.component';
import { StatisticsComponent } from './statistics/statistics.component';


const routes: Routes = [
    { path : '' , component : DashboardComponent},
    { path : 'reports' , component : ReportListComponent},
    { path : 'reports/:id' , component : ReportListComponent},
    { path : 'report/view/:id' , component : ReportViewComponent},
    { path : 'stat' , component : StatisticsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
