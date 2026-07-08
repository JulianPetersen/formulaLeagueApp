import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-service';
import { GlobalService } from 'src/app/services/global';
import { WalletService } from 'src/app/services/wallet-service';
import { WalletSummary } from 'src/app/models/wallet';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTextarea,
    IonToolbar
  ],
})
export class WalletPage implements OnInit {

  wallet: WalletSummary | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  payoutMethod = 'bank_transfer';
  accountAlias = '';
  claimNote = '';

  constructor(
    private walletService: WalletService,
    private global: GlobalService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadWallet();
  }

  ionViewWillEnter() {
    this.loadWallet();
  }

  loadWallet(event?: any) {
    this.isLoading = true;
    this.errorMessage = '';

    this.walletService.getWallet()
      .subscribe({
        next: (res: WalletSummary) => {
          this.wallet = res;
          this.isLoading = false;
          event?.target?.complete();
        },
        error: (err) => {
          this.isLoading = false;
          event?.target?.complete();

          if (err.status === 401) {
            this.global.presentConfirmAlert('ATENCION', '', 'Se vencio la sesion, debe iniciar sesion nuevamente', () => {
              this.auth.logout();
            });
            return;
          }

          this.errorMessage = err.error?.message || 'No pudimos cargar tu billetera';
        }
      });
  }

  requestClaim() {
    if (!this.wallet?.canClaim || this.isSubmitting || !this.accountAlias.trim()) {
      return;
    }

    const requestedAmount = this.wallet.availableBalance;

    this.isSubmitting = true;

    this.walletService.requestClaim({
      method: this.payoutMethod,
      accountAlias: this.accountAlias.trim(),
      note: this.claimNote?.trim()
    }).subscribe({
      next: (res: WalletSummary) => {
        this.wallet = res;
        this.isSubmitting = false;
        this.global.presentAlert('Solicitud enviada', '', `Recibimos tu solicitud por ${this.formatMoney(requestedAmount)}.`);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.global.presentAlert('Error', '', err.error?.message || 'No se pudo solicitar el cobro');
      }
    });
  }

  getClaimStatusLabel() {
    const status = this.wallet?.claim?.status;

    if (!status) return 'Sin solicitud';

    const labels = {
      available: 'Disponible',
      pending: 'En revision',
      approved: 'Aprobado',
      paid: 'Pagado',
      rejected: 'Rechazado',
      not_available: 'No disponible'
    };

    return labels[status] || 'Sin solicitud';
  }

  getWalletSubtitle() {
    if (!this.wallet) return '';
    if (this.wallet.availableBalance > 0) return 'Tenes saldo disponible para solicitar cobro';
    if (this.wallet.pendingBalance > 0) return 'Tenes un cobro en revision';
    if (this.wallet.totalPaid > 0) return 'Tus cobros pagados quedan registrados aca';
    return 'Cuando ganes un premio, se acredita automaticamente aca';
  }

  getClaimMessage() {
    const status = this.wallet?.claim?.status;

    if (!this.wallet) return '';
    if (this.wallet.pendingBalance > 0 && (status === 'pending' || status === 'approved')) {
      return `Hay ${this.formatMoney(this.wallet.pendingBalance)} reservados para tu solicitud de cobro.`;
    }
    if (status === 'paid') return 'Tu ultimo cobro fue marcado como pagado.';
    if (status === 'rejected') {
      return this.wallet.claim?.rejectedReason || 'Tu ultima solicitud fue rechazada. El saldo vuelve a estar disponible si corresponde.';
    }
    if (this.wallet.availableBalance > 0) return 'Podes solicitar el cobro del saldo disponible.';
    return 'Todavia no tenes saldo disponible para retirar.';
  }

  formatMoney(value = 0) {
    const currency = this.wallet?.currency || 'USD';

    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value);
  }
}
