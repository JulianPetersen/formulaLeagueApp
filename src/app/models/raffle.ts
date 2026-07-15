export interface Raffle {
  _id: string;
  title: string;
  prizeName: string;
  description?: string;
  image?: string;
  costPerTicket: number;
  startsAt: string | Date;
  endsAt: string | Date;
  status: 'draft' | 'active' | 'closed' | 'drawn' | 'delivered' | 'cancelled';
  featured?: boolean;
  ticketsSold?: number;
  totalTickets: number;
  userTickets: number;
}

export interface RaffleWinner {
  raffle: string;
  title: string;
  prizeName: string;
  winner?: {
    _id: string;
    username?: string;
    email?: string;
  };
  ticketNumber?: number;
  drawnAt?: string | Date;
}

export type RafflePrizeClaimStatus = 'unclaimed' | 'claimed' | 'delivered';

export interface RafflePrize {
  _id: string;
  title: string;
  prizeName: string;
  description?: string;
  image?: string;
  status: 'drawn' | 'delivered';
  claimStatus: RafflePrizeClaimStatus;
  claimedAt?: string | Date;
  deliveredAt?: string | Date;
  drawnAt?: string | Date;
  ticketNumber?: number;
}

export interface RafflesResponse {
  balance: number;
  featured: Raffle | null;
  activeRaffles: Raffle[];
  myTickets: Array<{
    raffle: string;
    title: string;
    prizeName: string;
    userTickets: number;
  }>;
  winners: RaffleWinner[];
}

export interface BuyTicketsResponse {
  balance: number;
  raffle: Raffle;
  tickets: Array<{
    _id?: string;
    raffle: string;
    user: string;
    ticketNumber: number;
    cost: number;
  }>;
}
