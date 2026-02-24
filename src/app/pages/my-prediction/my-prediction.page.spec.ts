import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPredictionPage } from './my-prediction.page';

describe('MyPredictionPage', () => {
  let component: MyPredictionPage;
  let fixture: ComponentFixture<MyPredictionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPredictionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
