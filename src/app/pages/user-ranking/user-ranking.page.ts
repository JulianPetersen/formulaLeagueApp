import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { RefresherCustomEvent } from '@ionic/core';
import { UsersService } from 'src/app/services/users';
import { GlobalService } from 'src/app/services/global';
import { AuthService } from 'src/app/services/auth-service';

interface RankingUser {
  _id: string;
  username: string;
  points: number;
}

@Component({
  selector: 'app-user-ranking',
  templateUrl: './user-ranking.page.html',
  styleUrls: ['./user-ranking.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule, IonRefresher, IonRefresherContent]
})
export class UserRankingPage implements OnInit {
  topUsers: RankingUser[] = [];
  currentUserId = '';
  isLoading = true;

  constructor(
    private usersService: UsersService,
    private global: GlobalService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.setCurrentUser();
    this.getTopUsers();
  }

  getTopUsers() {
    this.isLoading = true;

    this.usersService.getTopUsers()
      .subscribe({
        next: ((res: any) => {
          this.topUsers = res;
          this.isLoading = false;
        }),
        error: (err) => {
          this.isLoading = false;
          this.handleAuthError(err);
        }
      });
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.usersService.getTopUsers()
      .subscribe({
        next: ((res: any) => {
          this.topUsers = res;
          event.target.complete();
        }),
        error: (err) => {
          event.target.complete();
          this.handleAuthError(err);
        }
      });
  }

  setCurrentUser() {
    const user = localStorage.getItem('user');

    if (!user) {
      return;
    }

    try {
      this.currentUserId = JSON.parse(user)?._id || '';
    } catch {
      this.currentUserId = '';
    }
  }

  getInitials(username = ''): string {
    return username
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'RM';
  }

  getPositionLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  private handleAuthError(err: any) {
    if (err.status == 401) {
      this.global.presentConfirmAlert('ATENCION', '', 'se vencio la sesion, debe iniciar sesion nuevamente', () => {
        this.auth.logout();
      });
    }
  }
}
