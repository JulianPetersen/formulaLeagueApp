import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { RacesServices } from 'src/app/services/races-services';
import { RaceModel } from 'src/app/models/race-model';
import { PilotsModel } from 'src/app/models/pilots-model';
import { ComponentPilotsComponent } from './components/component-pilots/component-pilots.component';
import { InfoCarreraComponent } from "./components/info-carrera/info-carrera.component";
import { trophy,flashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PrizesService } from 'src/app/services/prizes-service';
import { PrizeModel } from 'src/app/models/prize-model';
import {

  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonButton,
  RefresherCustomEvent,
  IonToolbar

} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global';
import { AuthService } from 'src/app/services/auth-service';
import { UsersService } from 'src/app/services/users';
import { CreditsBannerComponent } from "./components/credits-banner/credits-banner.component";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule,
    ComponentPilotsComponent, InfoCarreraComponent, IonContent, IonIcon, IonContent,
    IonRefresher, IonButton,
    IonRefresherContent, IonHeader, IonToolbar, CreditsBannerComponent]

})
export class Tab1Page {

  prize: PrizeModel

  allRacesUpcoming: RaceModel[]
  showPilotsMap: { [key: string]: boolean } = {};
  userCredits = 0;
  constructor(private races: RacesServices, private prizeService: PrizesService,private router:Router,private global:GlobalService,private auth:AuthService,private userService:UsersService) {
    addIcons({ trophy,flashOutline });
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.getRace()
    this.getActivePrize()
      
    event.target.complete();
  
    
  }

  ionViewWillEnter() {
    this.getRace()
    this.getActivePrize()
    this.getUserCredits()
    this. getUserCredits()
    
  }

  getRace() {
    this.races.getAllRacesLista()
      .subscribe((res: RaceModel[]) => {
        console.log(res)
        this.allRacesUpcoming = res;

      })
  }


  getActivePrize() {
    this.prizeService.getAcivePrize()
      .subscribe({
        next: ((res: PrizeModel) => {
          console.log('prize', res)
          this.prize = res
        }),
        error: (err) => {
          if (err.status == 401) {
            this.global.presentConfirmAlert('ATENCION', "", "se venció la sesion, debe iniciar sesion nuevamente", () => {
              this.auth.logout();
            })
          }
        }

      })
  }


  getUserCredits(){
    this.userService.getCreditsByUser()
      .subscribe({
        next: ((res)=>{
          this.userCredits = res;
          console.log(res)
        }),
        error: ((err) => {
          console.log(err)
        })
      })
  }


goToGame(){
  this.router.navigateByUrl('tabs/game-semaforo')
}

goToWallet(){
  this.router.navigateByUrl('tabs/wallet')
}

togglePilots(raceId: string) {
  this.showPilotsMap[raceId] = !this.showPilotsMap[raceId];
}


}
