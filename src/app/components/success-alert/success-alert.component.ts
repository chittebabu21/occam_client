import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.scss']
})
export class SuccessAlertComponent {
  @Input() uniqueId = '';
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  saveAsImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = 300;
      canvas.height = 200;

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = '20px serif';
      context.fillStyle = '#EE4036';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      context.fillText(`Reg ID: ${this.uniqueId.toUpperCase()}`, canvas.width / 2, canvas.height / 2);
      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = image;
      link.download = `reg_id_${this.uniqueId}.png`;
      
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    }
  }

  onClose() {
    this.close.emit();
  }
}
