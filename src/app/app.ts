import { Component } from '@angular/core';
import { GenerateQr } from './features/components/generate-qr/generate-qr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GenerateQr],
  template: `
    <app-generate-qr></app-generate-qr>
  `,
})
export class App {
  title = 'video2QR';
}