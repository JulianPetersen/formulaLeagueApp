import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import type { ItemReorderEventDetail } from '@ionic/angular';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonButton,
  IonCardSubtitle,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonList,
  IonListHeader,
  IonIcon,
  IonReorder,
  IonReorderGroup
} from '@ionic/angular/standalone';
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
  imports: [IonContent, CommonModule
    , ComponentPilotsComponent, InfoCarreraComponent],
})
export class Tab1Page {

  AllPilotosRace: PilotsModel[] = []
  raceUpcoming:RaceModel;
  raceId:string;
  allRacesUpcoming:RaceModel[]
  constructor(private races: RacesServices) {
  }

  ngOnInit() {
    this.getRace()
  }

  getRace() {
    this.races.getAllRacesUpcoming()
      .subscribe((res: RaceModel[]) => {
        this.allRacesUpcoming = res;
        this.raceUpcoming = res[0]
        this.AllPilotosRace = res[0].pilots
        this.raceId = res[0]._id
      })
  }
}
