import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the Shalaj front page hero', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-slide.active h1')?.textContent).toContain(
      'Lieblingsplatz Jahreshighlights'
    );
    expect(compiled.querySelector('.brand img')?.getAttribute('alt')).toContain('Shalaj');
  });

  it('should render all 12 product categories', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.category-grid a').length).toBe(12);
  });

  it('should advance the hero slider', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as { activeSlide: () => number; next: () => void };
    fixture.detectChanges();
    expect(app.activeSlide()).toBe(0);
    app.next();
    expect(app.activeSlide()).toBe(1);
  });
});
