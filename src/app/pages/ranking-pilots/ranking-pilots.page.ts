import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardHeader, IonRefresher, IonRefresherContent, IonCardTitle, IonSegmentButton, IonLabel, IonSegment } from '@ionic/angular/standalone';
import { PilotsService } from 'src/app/services/pilots';
import { PilotsModel } from 'src/app/models/pilots-model';
import { TeamsService } from 'src/app/services/teams-service';
import { TeamsModel } from 'src/app/models/teams-model';
import { RefresherCustomEvent } from '@ionic/core';
import { GlobalService } from 'src/app/services/global';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-ranking-pilots',
  templateUrl: './ranking-pilots.page.html',
  styleUrls: ['./ranking-pilots.page.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonCardHeader, IonCardContent, CommonModule, FormsModule, IonCardTitle, IonSegmentButton, IonLabel, IonSegment, IonRefresher, IonRefresherContent]
})
export class RankingPilotsPage implements OnInit {

  segmentValue = 'Pilots';


  allPilots: PilotsModel[] = []
  allTeams: TeamsModel[] = []
  constructor(private pilots: PilotsService, private teams: TeamsService,private global:GlobalService,private auth:AuthService) { }

  ngOnInit() {
    this.getPilotsRanking();
    this.getRankingTeams()
  }



  getPilotsRanking() {
    this.pilots.getRankingPilots()
      .subscribe({
        next: ((res: PilotsModel[]) => {
          this.allPilots = res;
          console.log(this.allPilots)
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


  getRankingTeams() {
    this.teams.getRankingTeams()
      .subscribe({
        next: ((res: TeamsModel[]) => {
          this.allTeams = res;
          console.log(this.allTeams)
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



  handleRefresh(event: RefresherCustomEvent) {
    this.getPilotsRanking()
    this.getRankingTeams()

    event.target.complete();


  }
}
