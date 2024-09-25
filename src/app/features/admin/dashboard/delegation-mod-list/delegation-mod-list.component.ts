import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { Account } from '@app/_models';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-delegation-mod-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, UserInfoComponent],
  templateUrl: './delegation-mod-list.component.html',
  styleUrl: './delegation-mod-list.component.css'
})
export class DelegationModListComponent {
  @Input() delegationId!: any;
  @Output() moderatorSelected = new EventEmitter<string>();

  users : Account[] = []

  selectedUserId!: string;

  @ViewChild('userInfoPopup') userInfoPopup!: TemplateRef<any>;

  //regionId : any

  constructor (
    private accountService: AccountService,
    private modalService: NgbModal
  ) {}

  ngOnInit(){
    console.log('la deleg ici '+ this.delegationId)
    console.log('Delegation ID: ', this.delegationId._id);
      this.accountService.getModeratorByDelegation(this.delegationId._id).subscribe( data => {
        this.users = data
        console.log('user here '+ this.users)
      })
  }
   // Opens the user info popup and passes the selected user's ID
   openUserInfoPopup(userId: string): void {
    this.selectedUserId = userId;
    this.modalService.open(this.userInfoPopup, { size: 'lg' });
  }

  // Handles the click event for a moderator
  onModeratorClick(userId: string): void {
    this.moderatorSelected.emit(userId); // Emit selected moderator's ID
    this.openUserInfoPopup(userId); // Open the modal for user info
  }

  // Close the user popup
  closeUserPopup() {
    this.modalService.dismissAll();
  }
}
