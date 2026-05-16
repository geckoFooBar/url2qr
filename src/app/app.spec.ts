import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        App // Standalone component goes in imports
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the generator component', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges(); 
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('h2')?.textContent).toContain('Generate QR Code');
  });
});