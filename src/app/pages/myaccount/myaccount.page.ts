import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonIcon, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronForward, gift, logOut, mail, shieldCheckmark, speedometer, wallet } from 'ionicons/icons';
import { UsersService } from 'src/app/services/users';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service';
import { GlobalService } from 'src/app/services/global';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonInput, IonSpinner, IonIcon, RouterModule]
})
export class MyaccountPage implements OnInit {
  user: User;
  sendingVerification = false;
  changingEmail = false;
  showEmailChange = false;
  newEmail = '';

  constructor(
    private userService: UsersService,
    private auth: AuthService,
    private global: GlobalService
  ) {
    addIcons({ chevronForward, gift, logOut, mail, shieldCheckmark, speedometer, wallet });
  }

  ngOnInit() {
    this.getInfoUSer();
  }

  getInfoUSer() {
    this.userService.getInfoUser()
      .subscribe({
        next: ((res: User) => {
          this.user = res;
        }),
        error: (err) => {
          if (err.status == 401) {
            this.global.presentConfirmAlert('ATENCION', '', 'se vencio la sesion, debe iniciar sesion nuevamente', () => {
              this.auth.logout();
            });
          }
        }
      });
  }

  logout() {
    this.auth.logout();
  }

  sendVerificationEmail() {
    if (!this.user?.email || this.isEmailVerified() || this.sendingVerification) return;

    this.sendingVerification = true;
    this.sendVerificationTo(this.user.email);
  }

  changeEmailAndSendVerification() {
    const email = this.newEmail.trim().toLowerCase();

    if (!email || this.changingEmail) return;

    this.changingEmail = true;

    this.userService.updateEmail(email)
      .subscribe({
        next: (user) => {
          this.user = user;
          this.newEmail = '';
          this.showEmailChange = false;
          this.changingEmail = false;
          this.sendingVerification = true;
          this.sendVerificationTo(user.email);
        },
        error: (err) => {
          this.changingEmail = false;
          this.global.presentAlert('No se pudo cambiar', '', err.error?.message || 'Intentalo nuevamente.');
        }
      });
  }

  isEmailVerified() {
    return Boolean(this.user?.verified);
  }

  getEmailStatusLabel() {
    return this.isEmailVerified() ? 'Email verificado' : 'Email sin verificar';
  }

  getEmailStatusMessage() {
    if (this.isEmailVerified()) {
      return 'Tu cuenta ya tiene el correo validado.';
    }

    return 'Verifica tu correo para mantener tu cuenta protegida y recibir avisos importantes.';
  }

  getDisplayName() {
    return this.user?.username || this.user?.name || 'Usuario Race Mind';
  }

  getInitial() {
    return this.getDisplayName().trim().charAt(0).toUpperCase() || 'U';
  }

  private sendVerificationTo(email: string) {
    this.auth.resendVerification({ email })
      .subscribe({
        next: (res) => {
          this.sendingVerification = false;
          this.global.presentAlert('Email enviado', '', res?.message || 'Te enviamos un nuevo mail de verificacion.');
        },
        error: (err) => {
          this.sendingVerification = false;
          this.global.presentAlert('No se pudo enviar', '', err.error?.message || 'Intentalo nuevamente.');
        }
      });
  }
}
