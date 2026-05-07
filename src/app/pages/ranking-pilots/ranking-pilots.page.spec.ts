import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingPilotsPage } from './ranking-pilots.page';

describe('RankingPilotsPage', () => {
  let component: RankingPilotsPage;
  let fixture: ComponentFixture<RankingPilotsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingPilotsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
