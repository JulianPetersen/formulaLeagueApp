import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonSegment, IonSegmentButton, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { TraficLigth } from 'src/app/models/trafic-ligth';
import { TraficLigthgameService } from 'src/app/services/trafic-ligthgame';
type GameState = 'idle' | 'lights' | 'ready' | 'go' | 'finished' | 'false';
import { AdMob} from '@capacitor-community/admob';
@Component({
  selector: 'app-game-semaforo',
  templateUrl: './game-semaforo.page.html',
  styleUrls: ['./game-semaforo.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonLabel, IonSegment, IonSegmentButton, IonButton, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle]
})
export class GameSemaforoPage {

  constructor(private traficGameService: TraficLigthgameService) { }


  async ngOnInit() {
    await AdMob.initialize();
    this.getBestTimeUser()
  }

  state: GameState = 'idle';
  segmentValue = 'game';
  lights: boolean[] = [false, false, false, false, false];
  gameCount: number = 0;
  startTime: number = 0;
  reactionTime: number = 0;

  bestTime: number | null = null;

  timeouts: any[] = [];

  ranking: TraficLigth[] = [];

  startGame() {
    this.reset();
    this.state = 'lights';

    this.lights.forEach((_, i) => {
      const t = setTimeout(() => {
        this.lights[i] = true;
      }, (i + 1) * 700);
      this.timeouts.push(t);
    });

    // después de prender todas
    const totalLightsTime = 5 * 700;

    const randomDelay = 1000 + Math.random() * 2000;

    const goTimeout = setTimeout(() => {
      this.turnOffLights();
      this.state = 'go';
      this.startTime = Date.now();
    }, totalLightsTime + randomDelay);

    this.timeouts.push(goTimeout);
  }

  handleTap() {
    if (this.state === 'lights' || this.state === 'ready') {
      this.falseStart();
      return;
    }

    if (this.state === 'go') {
      this.reactionTime = Date.now() - this.startTime;
      this.state = 'finished';
      this.gameCount++;

      if (this.gameCount >= 4) {
        this.showAd();
        this.gameCount = 0;
      }
      if (!this.bestTime || this.reactionTime < this.bestTime) {
        this.bestTime = this.reactionTime;
        const data: TraficLigth = {
          bestResult: this.bestTime,
        }
        this.traficGameService.createNewRecord(data)
          .subscribe({
            next: ((res: TraficLigth[]) => {
              this.ranking = res
              console.log(res)
            }),
            error: ((err) => {
              console.log(err)
            })
          })
      }
      this.getBestTimeUser();
    }
  }

  falseStart() {
    this.clearTimeouts();
    this.state = 'false';
  }

  turnOffLights() {
    this.lights = [false, false, false, false, false];
  }

  reset() {
    this.clearTimeouts();
    this.lights = [false, false, false, false, false];
    this.state = 'idle';
  }

  clearTimeouts() {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
  }


  getBestTimeUser() {
    this.traficGameService.getBestTimeByUser()
      .subscribe({
        next: ((res: TraficLigth[]) => {
          console.log(res)
          this.ranking = res
        }),
        error: (err) => { console.log }
      })
  }



  async showAd() {

    const options = {
      adId: 'ca-app-pub-3940256099942544/1033173712' // TEST ID
    };

    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();

  }
}
