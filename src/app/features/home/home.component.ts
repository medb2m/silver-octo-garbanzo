import { Component } from '@angular/core';
import { Account } from '@app/_models';
import { AccountService } from '@app/_services';



@Component({ templateUrl: 'home.component.html', styleUrls: ['home.component.css'] })
export class HomeComponent {
    account?: Account | null;

    
    constructor (
        private accountService: AccountService
    ) {}

    ngOnInit(){
        this.accountService.account.subscribe(x => this.account = x);
    }
}