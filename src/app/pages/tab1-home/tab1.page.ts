import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { RacesServices } from 'src/app/services/races-services';
import { RaceModel } from 'src/app/models/race-model';
import { ComponentPilotsComponent } from './components/component-pilots/component-pilots.component';
import { InfoCarreraComponent } from "./components/info-carrera/info-carrera.component";
import {
  chevronForward,
  flash,
  flag,
  gameController,
  podium,
  speedometer,
  ticket,
  trophy
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PrizesService } from 'src/app/services/prizes-service';
import { PrizeModel } from 'src/app/models/prize-model';
import {

  IonHeader,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
  IonToolbar

} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global';
import { AuthService } from 'src/app/services/auth-service';
import { UsersService } from 'src/app/services/users';
import { UserRankingPosition } from 'src/app/models/user';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule,
    ComponentPilotsComponent, InfoCarreraComponent, IonContent, IonIcon,
    IonRefresher,
    IonRefresherContent, IonHeader, IonToolbar]

})
export class Tab1Page {

  prize: PrizeModel

  allRacesUpcoming: RaceModel[] = [];
  showPilotsMap: { [key: string]: boolean } = {};
  userCredits = 0;
  rankingPosition: UserRankingPosition;
  constructor(private races: RacesServices, private prizeService: PrizesService,private router:Router,private global:GlobalService,private auth:AuthService,private userService:UsersService) {
    addIcons({ chevronForward, flash, flag, gameController, podium, speedometer, ticket, trophy });
  }

  get firstUpcomingRace() {
    return this.allRacesUpcoming?.[0];
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.getRace()
    this.getActivePrize()
    this.getMyRankingPosition()
      
    event.target.complete();
  
    
  }

  ionViewWillEnter() {
    this.getRace()
    this.getActivePrize()
    this.getUserCredits()
    this.getMyRankingPosition()
    
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


  getMyRankingPosition(){
    this.userService.getMyRankingPosition()
      .subscribe({
        next: ((res: UserRankingPosition) => {
          this.rankingPosition = res;
        }),
        error: ((err) => {
          console.log(err)
        })
      })
  }


goToGame(){
  this.router.navigateByUrl('tabs/game-semaforo')
}

goToReflexGame(){
  this.router.navigateByUrl('tabs/reflex-game')
}

goToRoadRush(){
  this.router.navigateByUrl('tabs/road-rush')
}

goToRaffles(){
  this.router.navigateByUrl('tabs/raffles')
}

goToWallet(){
  this.router.navigateByUrl('tabs/wallet')
}

goToRanking(){
  this.router.navigateByUrl('tabs/user-ranking')
}

gotoCreditCenter(){
  this.router.navigateByUrl('tabs/credits-page')
}

goToPredictionSection(){
  document.getElementById('home-predictions-section')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

goToRaces(){
  this.router.navigateByUrl('tabs/tab2')
}

goToNews(){
  this.router.navigateByUrl('tabs/news')
}

togglePilots(raceId: string) {
  this.showPilotsMap[raceId] = !this.showPilotsMap[raceId];
}


}
