import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccountService } from '@app/_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  @Input() userId!: string;  // ID of the selected user
  user: any;  // User object to store fetched data

  constructor(
    private accountService: AccountService,
  private modalService: NgbModal) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    this.accountService.getById(this.userId).subscribe(user => {
      this.user = user;
    });
  }

  // Close the user popup
  closeUserPopup() {
    // close only the lastModal here
    this.modalService.dismissAll();
  }
}
