import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonSpinner,
  IonToolbar
} from '@ionic/angular/standalone';
import { Raffle, RaffleWinner } from 'src/app/models/raffle';
import { GlobalService } from 'src/app/services/global';
import { RafflesService } from 'src/app/services/raffles-service';

@Component({
  selector: 'app-raffles',
  templateUrl: './raffles.page.html',
  styleUrls: ['./raffles.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonSpinner,
    IonToolbar
  ]
})
export class RafflesPage implements OnInit, OnDestroy {
  balance = 0;
  selectedQuantity = 1;
  raffleQuantities: Record<string, number> = {};
  featured: Raffle | null = null;
  previewRaffle: Raffle | null = null;
  activeRaffles: Raffle[] = [];
  winners: RaffleWinner[] = [];
  isLoading = false;
  isBuying = false;
  errorMessage = '';
  now = Date.now();
  private countdownInterval?: ReturnType<typeof setInterval>;

  constructor(
    private rafflesService: RafflesService,
    private global: GlobalService
  ) {}

  ngOnInit() {
    this.startCountdown();
    this.loadRaffles();
  }

  ionViewWillEnter() {
    this.startCountdown();
    this.loadRaffles();
  }

  ionViewDidLeave() {
    this.stopCountdown();
  }

  ngOnDestroy() {
    this.stopCountdown();
  }

  get purchaseCost() {
    return this.featured ? this.featured.costPerTicket * this.selectedQuantity : 0;
  }

  get myTickets() {
    const tickets = [];

    if (this.featured?.userTickets) {
      tickets.push(this.featured);
    }

    return tickets.concat(this.activeRaffles.filter((raffle) => {
      return raffle._id !== this.featured?._id && raffle.userTickets > 0;
    }));
  }

  loadRaffles() {
    this.isLoading = true;
    this.errorMessage = '';

    this.rafflesService.getRaffles()
      .subscribe({
        next: (res) => {
          this.balance = res.balance || 0;
          this.featured = res.featured;
          this.activeRaffles = (res.activeRaffles || []).filter((raffle) => {
            return raffle._id !== res.featured?._id;
          });
          this.winners = res.winners || [];
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'No pudimos cargar los sorteos';
        }
      });
  }

  setQuantity(quantity: number) {
    this.selectedQuantity = quantity;
  }

  setRaffleQuantity(raffle: Raffle, quantity: number) {
    this.raffleQuantities[raffle._id] = quantity;
  }

  getRaffleQuantity(raffle: Raffle) {
    return this.raffleQuantities[raffle._id] || 1;
  }

  getRaffleCost(raffle: Raffle) {
    return raffle.costPerTicket * this.getRaffleQuantity(raffle);
  }

  buyFeaturedTicket() {
    if (!this.featured) return;
    this.buyTickets(this.featured, this.selectedQuantity);
  }

  buyTicket(raffle: Raffle) {
    this.buyTickets(raffle, this.getRaffleQuantity(raffle));
  }

  openImagePreview(raffle: Raffle) {
    if (!this.getRaffleImage(raffle)) return;
    this.previewRaffle = raffle;
  }

  closeImagePreview() {
    this.previewRaffle = null;
  }

  buyTickets(raffle: Raffle, quantity: number) {
    const totalCost = raffle.costPerTicket * quantity;

    if (this.balance < totalCost || this.isBuying) {
      return;
    }

    this.global.presentConfirmAlert(
      'Confirmar compra',
      raffle.title,
      `Vas a comprar ${quantity} ticket${quantity > 1 ? 's' : ''} por ${totalCost} RM coins.`,
      () => this.confirmBuyTickets(raffle, quantity)
    );
  }

  private confirmBuyTickets(raffle: Raffle, quantity: number) {
    this.isBuying = true;

    this.rafflesService.buyTickets(raffle._id, quantity)
      .subscribe({
        next: (res) => {
          this.balance = res.balance;
          this.patchRaffle(res.raffle);
          this.isBuying = false;
          this.global.presentAlert(
            'Ticket comprado',
            '',
            `Ya tenes ${res.raffle.userTickets} tickets para este sorteo.`
          );
        },
        error: (err) => {
          this.isBuying = false;
          this.global.presentAlert(
            'No se pudo comprar',
            '',
            err.error?.message || 'Intentalo nuevamente'
          );
        }
      });
  }

  patchRaffle(updatedRaffle: Raffle) {
    if (this.featured?._id === updatedRaffle._id) {
      this.featured = updatedRaffle;
    }

    this.activeRaffles = this.activeRaffles.map((raffle) => {
      return raffle._id === updatedRaffle._id ? updatedRaffle : raffle;
    });
  }

  getCountdown(endsAt?: string | Date) {
    if (!endsAt) return '-';

    const diff = new Date(endsAt).getTime() - this.now;

    if (diff <= 0) return 'Cerrado';

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;

    return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  private startCountdown() {
    this.stopCountdown();
    this.now = Date.now();
    this.countdownInterval = setInterval(() => {
      this.now = Date.now();
    }, 1000);
  }

  private stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }

  private padTime(value: number) {
    return String(value).padStart(2, '0');
  }

  getRaffleImage(raffle?: Raffle | null) {
    return raffle?.image;
  }

  getRaffleBackground(raffle?: Raffle | null) {
    return raffle?.image ? `url("${raffle.image}")` : '';
  }

  getWinnerName(winner: RaffleWinner) {
    return winner.winner?.username || winner.winner?.email || 'Usuario';
  }

  getWinnerDate(winner: RaffleWinner) {
    if (!winner.drawnAt) return '';

    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short'
    }).format(new Date(winner.drawnAt));
  }
}
