import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'app-exit-confirm',
    template: `
      <div class="exit-confirm">
        <h3>{{ 'confirmExit' | translate }}</h3>
        <p>{{ 'markReportAsTreated' | translate }}</p>
        <button (click)="confirmExit(true)">{{ 'yes' | translate }}</button>
        <button (click)="confirmExit(false)">{{ 'no' | translate }}</button>
      </div>
    `,
    standalone: true,
    imports: [TranslateModule, CommonModule],
    styles: [`
      .exit-confirm {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
      }
  
      button {
        margin: 5px;
        padding: 10px 15px;
        cursor: pointer;
        background: #007bff;
        border: none;
        color: white;
        border-radius: 5px;
      }
  
      button:hover {
        background: #0056b3;
      }
    `]
  })
  export class ExitConfirmComponent {
    @Input() isTreated?: boolean;
  
    constructor(public activeModal: NgbActiveModal) {}
  
    confirmExit(markAsTreated: boolean) {
      this.activeModal.close(markAsTreated);  // Close the modal and pass the decision
    }
  }