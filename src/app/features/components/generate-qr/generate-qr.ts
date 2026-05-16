import { Component } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-generate-qr',
  standalone: true,
  template: `
  <div class="w-screen h-screen flex flex-col justify-center items-center p-4 sm:p-8 w-full max-w-3xl mx-auto">
    
    <div class="w-full bg-white shadow-xl ring-1 ring-gray-900/5 rounded-3xl p-6 sm:p-10">
      
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Generate QR Code</h2>
        <p class="text-sm text-gray-500 mt-2">Enter a URL to instantly generate a high-quality QR code.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div class="sm:col-span-2 flex flex-col gap-2">
          <label for="videoUrl" class="text-sm font-semibold text-gray-700">URL</label>
          <div class="relative">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            <input 
              id="videoUrl"
              class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              type="url" 
              placeholder="https://www.youtube.com/watch?v=..." 
              #videoUrlInput 
              (input)="0" 
            />
          </div>
        </div>
        
        <div class="flex flex-col gap-2">
          <label for="size-select" class="text-sm font-semibold text-gray-700">Size</label>
          <div class="relative">
            <select 
              id="size-select" 
              class="w-full py-3 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer" 
              #sizeInput>
              <option value="250">250 x 250 px</option>
              <option value="350" selected>350 x 350 px</option>
              <option value="500">500 x 500 px</option>
              <option value="1000">1000 x 1000 px</option>
            </select>
            <svg class="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
          </div>
        </div>
      </div>

      <div class="relative flex justify-center items-center w-full max-w-[280px] aspect-square mx-auto rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 transition-all duration-300"
           [class.border-transparent]="qrCodeUrl"
           [class.bg-transparent]="qrCodeUrl">
        
        @if (qrCodeUrl) {
          <div class="absolute inset-0 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-2xl -z-10 blur-xl opacity-60"></div>
          <img class="object-contain w-full h-full rounded-2xl shadow-lg ring-1 ring-black/5 bg-white p-3" [src]="qrCodeUrl" alt="Generated QR Code"/>
        } @else {
          <div class="flex flex-col items-center text-gray-400">
            <svg class="w-14 h-14 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            <p class="text-sm font-medium">QR preview</p>
          </div>
        }
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 w-full">
        <button 
          class="w-full bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm flex items-center justify-center gap-2" 
          (click)="clear(videoUrlInput)">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          Clear
        </button>

        <button 
          class="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          (click)="generate(videoUrlInput.value, sizeInput.value)">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Generate
        </button>
        
        <button 
          class="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2" 
          [disabled]="!qrCodeUrl" 
          (click)="download()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download
        </button>
      </div>

    </div>
  </div>
  `,
})
export class GenerateQr {

  qrCodeUrl = "";

  async generate(text: string, sizeStr: string) {
    if (text.trim() === "") return;
    const size = parseInt(sizeStr, 10) || 350;

    try {
      this.qrCodeUrl = await QRCode.toDataURL(text, { 
        width: size,
        margin: 2 
      });
    } catch (err) {
      console.error('Error generating QR code', err);
    }
  }

  clear(inputElement: HTMLInputElement) {   
    this.qrCodeUrl = "";
    inputElement.value = ""; 
  }

  download() {
    if (!this.qrCodeUrl) return;

    const a = document.createElement('a');
    a.href = this.qrCodeUrl;
    a.download = 'video2qr-code.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}