import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditsPagePage } from './credits-page.page';

describe('CreditsPagePage', () => {
  let component: CreditsPagePage;
  let fixture: ComponentFixture<CreditsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
