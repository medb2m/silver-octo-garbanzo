import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, RegionService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' , styleUrls: ['list.component.css'] })
export class ListComponent implements OnInit {
    accounts?: any[];
    searchText = ''

    // Pagination 
    currentPage = 1;
    itemsPerPage = 10; // Set the number of items per page

    constructor(
        private accountService: AccountService,
        private regionService: RegionService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }
    

    deleteAccount(id: string) {
        const account = this.accounts!.find(x => x.id === id);
        account.isDeleting = true;
    
        if (account.role === 'User') {
            // If the account is a User, remove them from the city first
            this.accountService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.regionService.removeWorker(account.city._id, account.id).subscribe(() => {
                        this.alertService.success('User removed from city');
                        this.accounts = this.accounts!.filter(x => x.id !== id);
                    });
                });
        } else if (account.role === 'Moderator') {
            // If the account is a Moderator, perform a simple delete
            this.accountService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.alertService.success('Moderator account deleted');
                    this.accounts = this.accounts!.filter(x => x.id !== id);
                });
        }
    }
    
}