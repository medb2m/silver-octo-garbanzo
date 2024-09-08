import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout';
import { addReportComponent } from './add-report';

const SocialModule = () => import('@features/userModule/userfeatures/social').then(x => x.SocialModule);


const routes: Routes = [
  
  {
    path: '', component: LayoutComponent,
    children: [
        { path: 'add', component: addReportComponent },
        { path: 'social', loadChildren: SocialModule  },
    ]
},
// otherwise redirect to home
{ path: '**', redirectTo: 'add' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserFeaturesRoutingModule { }
