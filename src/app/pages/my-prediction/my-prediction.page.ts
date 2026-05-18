import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PredictionsService } from 'src/app/services/predictions';
import { PredictionsModel } from 'src/app/models/predictions';
import { ListMyPredictionComponent } from './components/list-my-prediction/list-my-prediction.component';
import { GlobalService } from 'src/app/services/global';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-my-prediction',
  templateUrl: './my-prediction.page.html',
  styleUrls: ['./my-prediction.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ListMyPredictionComponent]
})
export class MyPredictionPage implements OnInit {

  constructor(private predictionService:PredictionsService,private global:GlobalService,private auth:AuthService) { }

  predictions:PredictionsModel[]

  ngOnInit() {
     console.log('re',this.getMyAllPredictions())
  }


  getMyAllPredictions(){
    this.predictionService.getMyAllPredictions()
      .subscribe({
        next: ((res:PredictionsModel[]) => {
          console.log(res)
          this.predictions = res
        }),
        error: (err => {
          console.log(err)
          if(err.status == 401){
            this.global.presentConfirmAlert('ATENCION', "", "se venció la sesion, debe iniciar sesion nuevamente", ()=>{
              this.auth.logout();
            })
          }
        }) 
      })
  }
}
