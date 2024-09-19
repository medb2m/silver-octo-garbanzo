import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { Account } from '@app/_models';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserInfoComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  @Input() regionId!: string;
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
    this.accountService.getModeratorByRegion(this.regionId).subscribe( data => {
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
