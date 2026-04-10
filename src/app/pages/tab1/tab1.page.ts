import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {IonContent, IonIcon } from '@ionic/angular/standalone';

import { RacesServices } from 'src/app/services/races-services';
import { RaceModel } from 'src/app/models/race-model';
import { PilotsModel } from 'src/app/models/pilots-model';
import { ComponentPilotsComponent } from './components/component-pilots/component-pilots.component';
import { InfoCarreraComponent } from "./components/info-carrera/info-carrera.component";
import { trophy } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PrizesService } from 'src/app/services/prizes-service';
import { PrizeModel } from 'src/app/models/prize-model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule,
    ComponentPilotsComponent, InfoCarreraComponent, IonContent, IonIcon],
})
export class Tab1Page {

  prize:PrizeModel

  allRacesUpcoming:RaceModel[]
  constructor(private races: RacesServices, private prizeService:PrizesService) {
    addIcons({ trophy});
  }

  ionViewWillEnter() {
    this.getRace()
    this.getActivePrize()
  }

  getRace() {
    this.races.getAllRacesLista()
      .subscribe((res: RaceModel[]) => {
        console.log(res)
        this.allRacesUpcoming = res;

      })
  }


  getActivePrize(){
    this.prizeService.getAcivePrize()
      .subscribe ({
        next: ((res:PrizeModel) => {
          console.log('prize', res)
          this.prize = res
        }),
        error: ((err) => {
          console.log(err)
        })
      })
  }

}
