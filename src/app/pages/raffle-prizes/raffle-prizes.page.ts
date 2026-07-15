import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonSpinner,
  IonToolbar
} from '@ionic/angular/standalone';
import { RafflePrize } from 'src/app/models/raffle';
import { GlobalService } from 'src/app/services/global';
import { RafflesService } from 'src/app/services/raffles-service';
import { UsersService } from 'src/app/services/users';

@Component({
  selector: 'app-raffle-prizes',
  templateUrl: './raffle-prizes.page.html',
  styleUrls: ['./raffle-prizes.page.scss'],
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
export class RafflePrizesPage implements OnInit {
  prizes: RafflePrize[] = [];
  isLoading = false;
  claimingPrizeId = '';
  errorMessage = '';

  constructor(
    private rafflesService: RafflesService,
    private global: GlobalService,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.loadPrizes();
  }

  ionViewWillEnter() {
    this.loadPrizes();
  }

  loadPrizes() {
    this.isLoading = true;
    this.errorMessage = '';

    this.rafflesService.getMyPrizes()
      .subscribe({
        next: (prizes) => {
          this.prizes = prizes || [];
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'No pudimos cargar tus premios';
        }
      });
  }

  claimPrize(prize: RafflePrize) {
    if (this.claimingPrizeId || prize.claimStatus !== 'unclaimed') return;

    this.claimingPrizeId = prize._id;

    this.usersService.getInfoUser()
      .subscribe({
        next: (user) => {
          this.claimingPrizeId = '';

          if (!user.verified) {
            this.global.presentConfirmAlert(
              'Email sin verificar',
              '',
              'Para reclamar un premio primero tenes que verificar tu email. Te llevamos a Mi cuenta para hacerlo.',
              () => {
                this.router.navigateByUrl('/tabs/myaccount');
              }
            );
            return;
          }

          this.global.presentConfirmAlert(
            'Reclamar premio',
            prize.prizeName,
            'Vamos a avisarle al equipo de Race Mind para coordinar la entrega.',
            () => this.confirmClaimPrize(prize)
          );
        },
        error: (err) => {
          this.claimingPrizeId = '';
          this.global.presentAlert('No se pudo validar', '', err.error?.message || 'Intentalo nuevamente');
        }
      });
  }

  private confirmClaimPrize(prize: RafflePrize) {
    this.claimingPrizeId = prize._id;

    this.rafflesService.claimPrize(prize._id)
      .subscribe({
        next: (updatedPrize) => {
          this.prizes = this.prizes.map((item) => {
            return item._id === updatedPrize._id ? updatedPrize : item;
          });
          this.claimingPrizeId = '';
          this.global.presentAlert('Reclamo enviado', '', 'Nos vamos a contactar para coordinar la entrega.');
        },
        error: (err) => {
          this.claimingPrizeId = '';
          this.global.presentAlert('No se pudo reclamar', '', err.error?.message || 'Intentalo nuevamente');
        }
      });
  }

  getPrizeImage(prize: RafflePrize) {
    return prize.image ? `url("${prize.image}")` : '';
  }

  getClaimLabel(prize: RafflePrize) {
    const labels = {
      unclaimed: 'Disponible para reclamar',
      claimed: 'Reclamo enviado',
      delivered: 'Entregado'
    };

    return labels[prize.claimStatus] || 'Disponible para reclamar';
  }

  getClaimDetail(prize: RafflePrize) {
    if (prize.claimStatus === 'delivered') return 'El equipo ya marco este premio como entregado.';
    if (prize.claimStatus === 'claimed') return 'Tu solicitud esta registrada. Race Mind va a coordinar la entrega.';
    return 'Tenes este premio pendiente de reclamo.';
  }

  getPrizeDate(prize: RafflePrize) {
    if (!prize.drawnAt) return '';

    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(prize.drawnAt));
  }
}
