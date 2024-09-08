import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditSocialComponent } from './add-edit-social'
import { ListSocialsComponent } from './list-socials'



const routes: Routes = [
    { path: '', component: ListSocialsComponent },
    { path: 'add', component: AddEditSocialComponent },
    { path: 'edit/:socialId', component: AddEditSocialComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SocialRoutingModule { }