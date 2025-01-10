import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.scss']
})
export class SuccessAlertComponent {
  @Input() uniqueId = '';
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
