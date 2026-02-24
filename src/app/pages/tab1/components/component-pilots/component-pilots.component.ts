import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PilotsModel } from 'src/app/models/pilots-model';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonButton,
  IonLabel,
  IonReorder,
  IonReorderGroup,
  IonAvatar
} from '@ionic/angular/standalone';



import { ItemReorderEventDetail } from '@ionic/core/components';
import { PredictionsService } from 'src/app/services/predictions';
import { PredictionsModel } from 'src/app/models/predictions';
import { GlobalService } from 'src/app/services/global';
@Component({
  selector: 'app-component-pilots',
  templateUrl: './component-pilots.component.html',
  styleUrls: ['./component-pilots.component.scss'],
  standalone:true,
  imports: [CommonModule,IonCard,
    IonCardContent,IonItem,IonButton,IonLabel,IonReorder,IonReorderGroup,IonAvatar
  ],
})
export class ComponentPilotsComponent  implements OnChanges {
 
 
  @Input() listPilots: PilotsModel[] = [];
  @Input() raceId: string
  predictionAlreadyExists = false;
  isLoadingPrediction = true;

  constructor(private prediction:PredictionsService,private global:GlobalService) { }


ngOnChanges(changes: SimpleChanges) {
    if (changes['listPilots']) {
      console.log(
        'pilotos recibidos en el hijo',
        this.listPilots
      );
    }
    if (changes['raceId'] && this.raceId) {
      this.checkIfPredictionExists();
    }
    console.log('raceId desde component pilot',this.raceId)
  }


    doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
      const from = ev.detail.from;
      const to = ev.detail.to;
  
      const moved = this.listPilots.splice(from, 1)[0];
      this.listPilots.splice(to, 0, moved);
  
      ev.detail.complete();
    }

      /** payload listo para el backend */
  buildPredictionPayload() {
    return this.listPilots.map((pilot, index) => ({
      pilot: pilot._id,
      position: index + 1
    }));
  }

  enviarData(){
    let payload:PredictionsModel = {
      userId:this.global.getUserId(),
      positions:this.buildPredictionPayload()
    }
    
    this.prediction.createPrediction(this.raceId,payload)
      .subscribe({
        next: ((res:any) => {
          console.log(res)
          this.checkIfPredictionExists()
        }),
        error: (err => {
          console.log(err)
          this.global.presentAlert('ERROR','',err.message)
        })
      })
  }
  

  checkIfPredictionExists() {
  this.prediction.getMyPredictionByRace(this.raceId)
    .subscribe({
      next: (res: any) => {
        this.predictionAlreadyExists = true;
        this.isLoadingPrediction = false;

        // Opcional: ordenar pilotos según lo guardado
        this.applySavedOrder(res.positions);
      },
      error: (err) => {
        // Si da 404 → no existe → puede pronosticar
        if (err.status === 404) {
          this.predictionAlreadyExists = false;
        }

        this.isLoadingPrediction = false;
      }
    });
}

applySavedOrder(savedPositions: any[]) {
  this.listPilots.sort((a, b) => {
    const posA = savedPositions.find(p => p.pilot._id === a._id)?.position;
    const posB = savedPositions.find(p => p.pilot._id === b._id)?.position;
    return (posA || 0) - (posB || 0);
  });
}
}
