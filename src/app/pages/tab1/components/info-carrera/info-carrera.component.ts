import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { RaceModel } from 'src/app/models/race-model';


@Component({
  selector: 'app-info-carrera',
  templateUrl: './info-carrera.component.html',
  standalone:true,
  imports:[IonCard,IonCardContent,DatePipe],
  styleUrls: ['./info-carrera.component.scss'],
})
export class InfoCarreraComponent  implements OnChanges {

 @Input() race!: RaceModel;

  remainingTime = '';
  private intervalId: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['race'] && this.race?.cutoff) {

      // ⛔ Evitar múltiples intervals
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.updateRemainingTime();

      this.intervalId = setInterval(() => {
        this.updateRemainingTime();
      }, 1000);
    }
  }

  updateRemainingTime() {
  const now = Date.now();
  const cutoff = new Date(this.race.cutoff).getTime();

  let diff = cutoff - now;

  if (diff <= 0) {
    this.remainingTime = 'Cerrado';
    clearInterval(this.intervalId);
    return;
  }

  const days = Math.floor(diff / 86_400_000);
  diff %= 86_400_000;

  const hours = Math.floor(diff / 3_600_000);
  diff %= 3_600_000;

  const minutes = Math.floor(diff / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  // 🧠 Mostrar días solo si existen
  this.remainingTime = days > 0
    ? `${days}d ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
    : `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
}

pad(value: number) {
  return value.toString().padStart(2, '0');
}

}
