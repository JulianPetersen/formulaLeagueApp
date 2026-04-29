import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameSemaforoPage } from './game-semaforo.page';

describe('GameSemaforoPage', () => {
  let component: GameSemaforoPage;
  let fixture: ComponentFixture<GameSemaforoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSemaforoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
