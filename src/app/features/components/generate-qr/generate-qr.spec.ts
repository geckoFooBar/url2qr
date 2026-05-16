import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateQr } from './generate-qr';
import * as QRCode from 'qrcode';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';

vi.mock('qrcode', () => ({
  toDataURL: vi.fn()
}));

describe('GenerateQr', () => {
  let component: GenerateQr;
  let fixture: ComponentFixture<GenerateQr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateQr], 
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateQr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty qrCodeUrl initially', () => {
    expect(component.qrCodeUrl).toBe('');
  });

  describe('generate()', () => {
    beforeEach(() => {
      // 2. Reset the mock before each test and provide a default resolved value
      (QRCode.toDataURL as Mock).mockReset();
      (QRCode.toDataURL as Mock).mockResolvedValue('data:image/png;base64,mockBase64String');
    });

    it('should not call QRCode.toDataURL if text is empty', async () => {
      await component.generate('   ', '350');
      
      expect(QRCode.toDataURL).not.toHaveBeenCalled();
      expect(component.qrCodeUrl).toBe('');
    });

    it('should generate a QR code with provided text and parsed size', async () => {
      await component.generate('https://angular.dev', '500');
      
      expect(QRCode.toDataURL).toHaveBeenCalledWith('https://angular.dev', {
        width: 500,
        margin: 2,
      });
      expect(component.qrCodeUrl).toBe('data:image/png;base64,mockBase64String');
    });

    it('should fallback to size 350 if sizeStr is invalid', async () => {
      await component.generate('https://angular.dev', 'invalid-size');
      
      expect(QRCode.toDataURL).toHaveBeenCalledWith('https://angular.dev', {
        width: 350,
        margin: 2,
      });
    });

    it('should handle errors gracefully and log them to console', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Generation failed');
      
      (QRCode.toDataURL as Mock).mockRejectedValueOnce(mockError);

      await component.generate('https://angular.dev', '350');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating QR code', mockError);
      expect(component.qrCodeUrl).toBe(''); // Should remain unchanged
    });
  });

  describe('clear()', () => {
    it('should clear the qrCodeUrl and reset the input element value', () => {

      component.qrCodeUrl = 'data:image/png;base64,someData';
      
      const mockInputElement = document.createElement('input');
      mockInputElement.value = 'https://youtube.com';

      component.clear(mockInputElement);

      expect(component.qrCodeUrl).toBe('');
      expect(mockInputElement.value).toBe('');
    });
  });

  describe('download()', () => {
    it('should do nothing if qrCodeUrl is empty', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      component.qrCodeUrl = '';
      
      component.download();
      
      expect(createElementSpy).not.toHaveBeenCalled();
    });

    it('should create an anchor element, click it, and remove it from the DOM', () => {
      component.qrCodeUrl = 'data:image/png;base64,mockBase64String';
      
      const mockAnchorElement = document.createElement('a');
      const clickSpy = vi.spyOn(mockAnchorElement, 'click').mockImplementation(() => {});
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchorElement as any);
      
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

      component.download();

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchorElement.href).toBe('data:image/png;base64,mockBase64String');
      expect(mockAnchorElement.download).toBe('video2qr-code.png');

      expect(appendChildSpy).toHaveBeenCalledWith(mockAnchorElement);
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockAnchorElement);
    });
  });
});