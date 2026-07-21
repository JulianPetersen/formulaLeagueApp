export interface RaceMindRushRecord {
  _id?: string;
  recordId?: string;
  user?: string;
  userId?: string;
  name?: string;
  score: number;
  distance: number;
  coinsCollected: number;
  durationMs?: number;
  earnedRm?: number;
  creditedRm?: number;
  week?: string;
  createdAt?: string;
}

export interface CreateRaceMindRushRecord {
  score: number;
  distance: number;
  coinsCollected: number;
  durationMs: number;
  startedAt: string;
  endedAt: string;
}

export interface RaceMindRushRecordResponse {
  record: RaceMindRushRecord;
  earnedRm: number;
  creditedRm: number;
  dailyLimit: number;
  dailyEarnedBefore: number;
  dailyEarnedAfter: number;
  rankingPosition: number | null;
  isWeeklyBest: boolean;
}

export interface RaceMindRushRewardStatus {
  dailyLimit: number;
  dailyEarned: number;
  dailyRemaining: number;
}
