import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { addIcons } from 'ionicons';
import { arrowBack, arrowForward, refresh, volumeHigh, volumeMute } from 'ionicons/icons';
import { RaceMindRushRecord, RaceMindRushRecordResponse } from '../../models/race-mind-rush';
import { RaceMindRushService } from '../../services/race-mind-rush';

type GameState = 'idle' | 'playing' | 'gameOver';
type RoadObjectType = 'enemy' | 'coin';
type SegmentValue = 'game' | 'ranking';

interface RoadObject {
  id: number;
  lane: number;
  y: number;
  type: RoadObjectType;
  scored?: boolean;
}

@Component({
  selector: 'app-road-rush',
  templateUrl: './road-rush.page.html',
  styleUrls: ['./road-rush.page.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonContent, IonIcon]
})
export class RoadRushPage implements OnDestroy {
  segmentValue: SegmentValue = 'game';
  state: GameState = 'idle';
  lanes = [16, 50, 84];
  playerLane = 1;
  playerY = 82;
  score = 0;
  coins = 0;
  distance = 0;
  speed = 1.35;
  enemies: RoadObject[] = [];
  roadCoins: RoadObject[] = [];
  ranking: RaceMindRushRecord[] = [];
  rewards = [3, 2, 1];
  soundEnabled = localStorage.getItem('roadRushSound') !== 'off';
  dailyLimit = 20;
  dailyRemaining = 20;
  lastRewardResult: RaceMindRushRecordResponse | null = null;
  isSavingScore = false;
  isLoadingRanking = false;
  saveScoreError = '';

  private animationFrame: number | null = null;
  private lastFrameTime = 0;
  private gameStartedAt = 0;
  private gameStartedAtIso = '';
  private nextEnemyAt = 0;
  private nextCoinAt = 0;
  private objectId = 0;
  private audioContext: AudioContext | null = null;
  private engineGain: GainNode | null = null;
  private engineOscillator: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private readonly playerHitWindow = { top: 73, bottom: 91 };

  constructor(private raceMindRushService: RaceMindRushService) {
    addIcons({ arrowBack, arrowForward, refresh, volumeHigh, volumeMute });
    this.loadRanking();
    this.loadRewardStatus();
  }

  ngOnDestroy() {
    this.stopLoop();
    this.stopEngineSound();
  }

  startGame() {
    this.stopLoop();
    this.state = 'playing';
    this.playerLane = 1;
    this.score = 0;
    this.coins = 0;
    this.distance = 0;
    this.speed = 1.35;
    this.lastRewardResult = null;
    this.saveScoreError = '';
    this.isSavingScore = false;
    this.enemies = [];
    this.roadCoins = [];
    this.lastFrameTime = performance.now();
    this.gameStartedAt = Date.now();
    this.gameStartedAtIso = new Date(this.gameStartedAt).toISOString();
    this.nextEnemyAt = this.lastFrameTime + 1400;
    this.nextCoinAt = this.lastFrameTime + 1900;
    this.startEngineSound();
    this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
  }

  showGame() {
    this.segmentValue = 'game';
  }

  showRanking() {
    this.segmentValue = 'ranking';
    this.loadRanking();
  }

  moveLeft() {
    if (this.state !== 'playing') {
      return;
    }

    const previousLane = this.playerLane;
    this.playerLane = Math.max(0, this.playerLane - 1);
    this.playLaneSound(previousLane);
    this.tapHaptic();
  }

  moveRight() {
    if (this.state !== 'playing') {
      return;
    }

    const previousLane = this.playerLane;
    this.playerLane = Math.min(this.lanes.length - 1, this.playerLane + 1);
    this.playLaneSound(previousLane);
    this.tapHaptic();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('roadRushSound', this.soundEnabled ? 'on' : 'off');

    if (this.soundEnabled && this.state === 'playing') {
      this.startEngineSound();
      this.playTone(520, 0.05, 'sine', 0.05);
      return;
    }

    this.stopEngineSound();
  }

  getPlayerLeft() {
    return this.lanes[this.playerLane];
  }

  getObjectLeft(object: RoadObject) {
    return this.lanes[object.lane];
  }

  get speedLabel() {
    return Math.round(118 + this.speed * 20);
  }

  get creditedRm() {
    if (this.state === 'gameOver' && this.lastRewardResult) {
      return this.lastRewardResult.creditedRm;
    }

    return Math.min(this.estimatedRm, this.dailyRemaining);
  }

  get estimatedRm() {
    if (this.score < 500) return 0;
    if (this.score < 1000) return 1;
    if (this.score < 2000) return 2;
    if (this.score < 3500) return 3;
    if (this.score < 5500) return 4;

    return 5;
  }

  private gameLoop(time: number) {
    if (this.state !== 'playing') {
      return;
    }

    const delta = Math.min(time - this.lastFrameTime, 40);
    this.lastFrameTime = time;

    this.updateScore(delta);
    this.updateObjects(delta);
    this.spawnObjects(time);
    this.checkCollisions();
    this.updateEngineSound();

    this.animationFrame = requestAnimationFrame((nextTime) => this.gameLoop(nextTime));
  }

  private updateScore(delta: number) {
    const seconds = delta / 1000;
    this.distance += this.speed * seconds * 7;
    this.score += Math.round(seconds * 12);
    this.speed = Math.min(4.1, 1.35 + this.distance / 820);
  }

  private updateObjects(delta: number) {
    const movement = this.speed * 0.7 * (delta / 16.67);

    this.enemies.forEach((enemy) => {
      enemy.y += movement;

      if (!enemy.scored && enemy.y > 100) {
        enemy.scored = true;
        this.score += 50;
      }
    });

    this.roadCoins.forEach((coin) => {
      coin.y += movement;
    });

    this.enemies = this.enemies.filter((enemy) => enemy.y < 118);
    this.roadCoins = this.roadCoins.filter((coin) => coin.y < 118);
  }

  private spawnObjects(time: number) {
    if (time >= this.nextEnemyAt) {
      this.enemies.push(this.createObject('enemy'));
      this.nextEnemyAt = time + Math.max(900, 1650 - this.speed * 90);
    }

    if (time >= this.nextCoinAt) {
      this.roadCoins.push(this.createObject('coin'));
      this.nextCoinAt = time + Math.max(1150, 2300 - this.speed * 90);
    }
  }

  private createObject(type: RoadObjectType): RoadObject {
    return {
      id: ++this.objectId,
      lane: Math.floor(Math.random() * this.lanes.length),
      y: -12,
      type
    };
  }

  private checkCollisions() {
    const hitsPlayer = (object: RoadObject) =>
      object.lane === this.playerLane &&
      object.y >= this.playerHitWindow.top &&
      object.y <= this.playerHitWindow.bottom;

    if (this.enemies.some(hitsPlayer)) {
      this.endGame();
      return;
    }

    this.roadCoins = this.roadCoins.filter((coin) => {
      if (!hitsPlayer(coin)) {
        return true;
      }

      this.coins += 1;
      this.score += 100;
      this.playCoinSound();
      this.coinHaptic();
      return false;
    });
  }

  private endGame() {
    this.state = 'gameOver';
    this.stopLoop();
    this.stopEngineSound();
    this.playCrashSound();
    this.saveScore();
    this.crashHaptic();
  }

  private saveScore() {
    if (this.score <= 0) {
      return;
    }

    const endedAt = new Date();

    this.isSavingScore = true;
    this.saveScoreError = '';

    this.raceMindRushService.createNewRecord({
      score: this.score,
      distance: Math.round(this.distance),
      coinsCollected: this.coins,
      durationMs: Math.max(1000, endedAt.getTime() - this.gameStartedAt),
      startedAt: this.gameStartedAtIso,
      endedAt: endedAt.toISOString()
    }).subscribe({
      next: (response) => {
        this.lastRewardResult = response;
        this.dailyLimit = response.dailyLimit;
        this.dailyRemaining = Math.max(0, response.dailyLimit - response.dailyEarnedAfter);
        this.isSavingScore = false;
        this.loadRanking();
      },
      error: () => {
        this.isSavingScore = false;
        this.saveScoreError = 'No pudimos guardar la partida. Las RM no fueron acreditadas.';
      }
    });
  }

  private loadRanking() {
    this.isLoadingRanking = true;

    this.raceMindRushService.getBestRecords().subscribe({
      next: (records) => {
        this.ranking = records;
        this.isLoadingRanking = false;
      },
      error: () => {
        this.ranking = [];
        this.isLoadingRanking = false;
      }
    });
  }

  private loadRewardStatus() {
    this.raceMindRushService.getRewardStatus().subscribe({
      next: (status) => {
        this.dailyLimit = status.dailyLimit;
        this.dailyRemaining = status.dailyRemaining;
      },
      error: () => {
        this.dailyLimit = 20;
        this.dailyRemaining = 20;
      }
    });
  }

  private stopLoop() {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private getAudioContext() {
    if (!this.soundEnabled) {
      return null;
    }

    this.audioContext ??= new AudioContext();
    this.audioContext.resume();

    return this.audioContext;
  }

  private startEngineSound() {
    const context = this.getAudioContext();

    if (!context || this.engineOscillator) {
      return;
    }

    this.engineGain = context.createGain();
    this.engineFilter = context.createBiquadFilter();
    this.engineOscillator = context.createOscillator();
    this.engineOscillator.type = 'triangle';
    this.engineOscillator.frequency.value = 48;
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 180;
    this.engineGain.gain.value = 0.018;
    this.engineOscillator.connect(this.engineFilter).connect(this.engineGain).connect(context.destination);
    this.engineOscillator.start();
  }

  private updateEngineSound() {
    if (!this.engineOscillator || !this.engineGain || !this.engineFilter || !this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;
    this.engineOscillator.frequency.setTargetAtTime(42 + this.speed * 10, now, 0.12);
    this.engineFilter.frequency.setTargetAtTime(150 + this.speed * 16, now, 0.12);
    this.engineGain.gain.setTargetAtTime(0.012 + this.speed * 0.003, now, 0.12);
  }

  private stopEngineSound() {
    if (!this.engineOscillator || !this.engineGain || !this.audioContext) {
      return;
    }

    this.engineGain.gain.setTargetAtTime(0.0001, this.audioContext.currentTime, 0.04);
    this.engineOscillator.stop(this.audioContext.currentTime + 0.08);
    this.engineOscillator = null;
    this.engineGain = null;
    this.engineFilter = null;
  }

  private playLaneSound(previousLane: number) {
    if (previousLane !== this.playerLane) {
      this.playTone(220, 0.07, 'triangle', 0.04, 360);
    }
  }

  private playCoinSound() {
    this.playTone(620, 0.06, 'sine', 0.06, 1040);
    window.setTimeout(() => this.playTone(980, 0.07, 'sine', 0.05), 45);
  }

  private playCrashSound() {
    this.playTone(96, 0.18, 'sawtooth', 0.12, 42);
  }

  private playTone(frequency: number, duration: number, type: OscillatorType, volume: number, endFrequency = frequency) {
    const context = this.getAudioContext();

    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  private async tapHaptic() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Haptics is only available on supported devices.
    }
  }

  private async coinHaptic() {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Haptics is only available on supported devices.
    }
  }

  private async crashHaptic() {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      // Haptics is only available on supported devices.
    }
  }
}
