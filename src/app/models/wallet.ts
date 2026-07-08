export type WalletClaimStatus = 'available' | 'pending' | 'approved' | 'paid' | 'rejected' | 'not_available';

export interface WalletClaim {
  _id?: string;
  status: WalletClaimStatus;
  method?: string;
  accountAlias?: string;
  note?: string;
  amount?: number;
  currency?: string;
  requestedAt?: string | Date;
  approvedAt?: string | Date;
  paidAt?: string | Date;
  rejectedReason?: string;
}

export interface WalletSummary {
  season: string;
  currency: string;
  accumulatedPrize: number;
  availableBalance: number;
  pendingBalance: number;
  totalPaid: number;
  prizeStatus: string;
  isWinner: boolean;
  canClaim: boolean;
  claim?: WalletClaim;
  updatedAt?: string | Date;
}

export interface WalletClaimRequest {
  method: string;
  accountAlias: string;
  note?: string;
}
