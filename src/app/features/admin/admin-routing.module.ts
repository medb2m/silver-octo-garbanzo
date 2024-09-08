import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout';

const AccountsModule = () => import('@features/admin').then(x => x.AccountsModule);
const DashboardModule = () => import('@features/admin').then(x => x.DashboardModule);
const ProfileModule = () => import('@features/accountsModule/profile').then(x => x.ProfileModule);
const RegionModule = () => import('@features/admin/placesModule').then(x => x.RegionsModule);
const CityModule = () => import('@features/admin/placesModule').then(x => x.CitiesModule);
const DelegationModule = () => import('@features/admin/placesModule').then(x => x.DelegationsModule);
const GenLinkModule = () => import('@features/admin/gen-link').then(x => x.GenLinkModule);
const SocialModule = () => import('@features/admin/socialModule/social').then(x => x.SocialModule);


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            //{ path: '', redirectTo  : 'dashboard' },
            { path: 'dashboard', loadChildren: DashboardModule },
            { path: 'accounts', loadChildren: AccountsModule },
            { path: 'profile', loadChildren: ProfileModule },
            // new work
            { path: 'generate-link', loadChildren: GenLinkModule },
            { path: 'regions', loadChildren: RegionModule },
            { path: 'delegations', loadChildren: DelegationModule },
            { path: 'cities', loadChildren: CityModule },
            { path: 'social', loadChildren: SocialModule },
        ]
    },
    //{ path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }