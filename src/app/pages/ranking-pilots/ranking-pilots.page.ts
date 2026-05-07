import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonCard,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle,IonSegmentButton,IonLabel,IonSegment } from '@ionic/angular/standalone';
import { PilotsService } from 'src/app/services/pilots';
import { PilotsModel } from 'src/app/models/pilots-model';
import { TeamsService } from 'src/app/services/teams-service';
import { TeamsModel } from 'src/app/models/teams-model';

@Component({
  selector: 'app-ranking-pilots',
  templateUrl: './ranking-pilots.page.html',
  styleUrls: ['./ranking-pilots.page.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonCardHeader, IonCardContent, CommonModule, FormsModule,IonCardSubtitle,IonCardTitle,IonSegmentButton,IonLabel,IonSegment]
})
export class RankingPilotsPage implements OnInit {

    segmentValue = 'Pilots';


    allPilots:PilotsModel[] =[] 
    allTeams:TeamsModel[] =[] 
    constructor(private pilots:PilotsService, private teams:TeamsService) { }

  ngOnInit() {
    this.getPilotsRanking();
    this.getRankingTeams()  
  }



  getPilotsRanking(){
    this.pilots.getRankingPilots()
      .subscribe({
        next :((res:PilotsModel[]) => {
          this.allPilots = res;
          console.log(this.allPilots )
        })
      })
  }


  getRankingTeams(){
    this.teams.getRankingTeams()
      .subscribe({
        next :((res:TeamsModel[]) => {
          this.allTeams = res;
          console.log(this.allTeams )
        })
      })
  }


}
