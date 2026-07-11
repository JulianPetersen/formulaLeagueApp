import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { ReflexGameRecord } from 'src/app/models/reflex-game';
import { AuthService } from 'src/app/services/auth-service';
import { GlobalService } from 'src/app/services/global';
import { ReflexGameService } from 'src/app/services/reflex-game';
import { AdMob } from '@capacitor-community/admob';

type ReflexState = 'idle' | 'waiting' | 'target' | 'hit' | 'miss' | 'finished';
type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'skipped';

interface ReflexAttempt {
  result: number | null;
  missed: boolean;
}

@Component({
  selector: 'app-reflex-game',
  templateUrl: './reflex-game.page.html',
  styleUrls: ['./reflex-game.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonLabel,
    IonSegment,
    IonSegmentButton
  ]
})
export class ReflexGamePage implements OnInit, OnDestroy {
  segmentValue = 'game';
  state: ReflexState = 'idle';
  saveState: SaveState = 'idle';
  round = 0;
  totalRounds = 5;
  reactionTime = 0;
  bestTime: number | null = null;
  averageTime: number | null = null;
  misses = 0;
  attempts: ReflexAttempt[] = [];
  ranking: ReflexGameRecord[] = [];
  myBestRecord: ReflexGameRecord | null = null;
  userLogedId: any;
  targetTop = 50;
  targetLeft = 50;

  private targetShownAt = 0;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private feedbackDelay = 650;

  constructor(
    private reflexGameService: ReflexGameService,
    private global: GlobalService,
    private auth: AuthService
  ) { }

 async ngOnInit() {
    this.userLogedId = JSON.parse(localStorage.getItem('user') || 'null');
    this.getRanking();
    this.getMyBestRecord();
    await AdMob.initialize();
  }

  ngOnDestroy() {
    this.clearPendingTimeout();
  }

  startGame() {
    this.clearPendingTimeout();
    this.round = 0;
    this.reactionTime = 0;
    this.bestTime = null;
    this.averageTime = null;
    this.misses = 0;
    this.attempts = [];
    this.saveState = 'idle';
    this.scheduleNextTarget();
  }

  scheduleNextTarget() {
    this.clearPendingTimeout();

    if (this.round >= this.totalRounds) {
      this.finishGame();
      return;
    }

    this.state = 'waiting';
    this.reactionTime = 0;

    const delay = 900 + Math.random() * 1800;
    this.timeout = setTimeout(() => this.showTarget(), delay);
  }

  showTarget() {
    this.targetTop = this.randomPosition();
    this.targetLeft = this.randomPosition();
    this.targetShownAt = Date.now();
    this.state = 'target';
  }

  handleBoardTap() {
    if (this.state === 'waiting') {
      this.registerMiss();
      return;
    }

    if (this.state === 'target') {
      this.registerMiss();
    }
  }

  handleTargetTap(event: Event) {
    event.stopPropagation();

    if (this.state !== 'target') {
      return;
    }

    this.reactionTime = Date.now() - this.targetShownAt;
    this.attempts.push({ result: this.reactionTime, missed: false });

    if (!this.bestTime || this.reactionTime < this.bestTime) {
      this.bestTime = this.reactionTime;
    }

    this.round++;
    this.state = 'hit';
    this.advanceAfterFeedback();
  }

  registerMiss() {
    this.clearPendingTimeout();
    this.misses++;
    this.attempts.push({ result: null, missed: true });
    this.round++;
    this.state = 'miss';
    this.advanceAfterFeedback();
  }

  resetGame() {
    this.clearPendingTimeout();
    this.state = 'idle';
    this.round = 0;
    this.reactionTime = 0;
    this.bestTime = null;
    this.averageTime = null;
    this.misses = 0;
    this.attempts = [];
    this.saveState = 'idle';
  }

  private finishGame() {
    const validResults = this.attempts
      .filter((attempt) => !attempt.missed && attempt.result !== null)
      .map((attempt) => attempt.result as number);

    this.averageTime = validResults.length
      ? Math.round(validResults.reduce((total, result) => total + result, 0) / validResults.length)
      : null;

    this.state = 'finished';
    this.saveFinishedGame();
    this.showAd();
  }

  private randomPosition() {
    return Math.round(14 + Math.random() * 72);
  }

  private advanceAfterFeedback() {
    this.clearPendingTimeout();
    this.timeout = setTimeout(() => this.scheduleNextTarget(), this.feedbackDelay);
  }

  private saveFinishedGame() {
    if (!this.bestTime || !this.averageTime) {
      this.saveState = 'skipped';
      return;
    }

    this.saveState = 'saving';

    this.reflexGameService.createNewRecord({
      bestResult: this.bestTime,
      averageResult: this.averageTime,
      attempts: this.totalRounds,
      misses: this.misses
    }).subscribe({
      next: () => {
        this.saveState = 'saved';
        this.getRanking();
        this.getMyBestRecord();
      },
      error: (err) => {
        this.saveState = 'error';
        this.handleError(err);
      }
    });
  }

  getRanking() {
    this.reflexGameService.getBestRecords()
      .subscribe({
        next: (res) => {
          this.ranking = res;
        },
        error: (err) => this.handleError(err)
      });
  }

  getMyBestRecord() {
    this.reflexGameService.getMyBestRecord()
      .subscribe({
        next: (res) => {
          this.myBestRecord = res;
        },
        error: (err) => {
          if (err.status !== 404) {
            this.handleError(err);
          }
        }
      });
  }

  private handleError(err: any) {
    console.log(err);

    if (err.status == 401) {
      this.global.presentConfirmAlert('ATENCION', "", "se vencio la sesion, debe iniciar sesion nuevamente", () => {
        this.auth.logout();
      });
    }
  }

  private clearPendingTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }



    async showAd() {

    const options = {
      // adId: 'ca-app-pub-3940256099942544/1033173712' // TEST ID
      adId: 'ca-app-pub-7377639735677577/7582767693' // PROD ID
    };

    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();

  }
}
