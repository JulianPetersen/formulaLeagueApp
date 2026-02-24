import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {IonContent } from '@ionic/angular/standalone';

import { RacesServices } from 'src/app/services/races-services';
import { RaceModel } from 'src/app/models/race-model';
import { PilotsModel } from 'src/app/models/pilots-model';
import { ComponentPilotsComponent } from './components/component-pilots/component-pilots.component';
import { InfoCarreraComponent } from "./components/info-carrera/info-carrera.component";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule,
    ComponentPilotsComponent, InfoCarreraComponent, IonContent],
})
export class Tab1Page {


  allRacesUpcoming:RaceModel[]
  constructor(private races: RacesServices) {
  }

  ngOnInit() {
    this.getRace()
  }

  getRace() {
    this.races.getAllRacesLista()
      .subscribe((res: RaceModel[]) => {
        console.log(res)
        this.allRacesUpcoming = res;

      })
  }
}
