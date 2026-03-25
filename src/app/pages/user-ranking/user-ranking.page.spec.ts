import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRankingPage } from './user-ranking.page';

describe('UserRankingPage', () => {
  let component: UserRankingPage;
  let fixture: ComponentFixture<UserRankingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRankingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
