import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, RedirectAdminGuard } from '@core/index';
import { Role } from '@app/_models';
import { HomeComponent } from './features/home';
import { AddLinkComponent } from './add-link/add-link.component';

const accountModule = () => import('@features/accountsModule').then(x => x.AccountsModule);
const adminModule = () => import('@features/admin/admin.module').then(x => x.AdminModule);
const PM = () => import('@features/accountsModule/profile/profile.module').then(x => x.ProfileModule);
const userModule = () => import('@features/userModule').then(x => x.UserFeaturesModule);


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [RedirectAdminGuard]},
    { path: 'account', loadChildren: accountModule },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Moderator] } },
    { path: 'profile', loadChildren: PM , canActivate : [AuthGuard] },
    { path: 'work', loadChildren: userModule , canActivate : [AuthGuard], data: { roles: [Role.User] }},
    { path: 'register-link/:token/:role', component: AddLinkComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
