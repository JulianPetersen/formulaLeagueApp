export interface ReflexGameRecord {
  _id?: string;
  user?: string;
  userId?: string;
  name?: string;
  bestResult: number;
  averageResult: number;
  attempts: number;
  misses: number;
  week?: string;
  createdAt?: string;
}

export interface CreateReflexGameRecord {
  bestResult: number;
  averageResult: number;
  attempts: number;
  misses: number;
}
