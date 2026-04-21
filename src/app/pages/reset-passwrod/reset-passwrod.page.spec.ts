import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswrodPage } from './reset-passwrod.page';

describe('ResetPasswrodPage', () => {
  let component: ResetPasswrodPage;
  let fixture: ComponentFixture<ResetPasswrodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswrodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
