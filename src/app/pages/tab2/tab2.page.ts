import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent , IonCard, IonCardContent} from '@ionic/angular/standalone';
import { RaceModel } from 'src/app/models/race-model';
import { RacesServices } from 'src/app/services/races-services';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [CommonModule, IonCard, IonCardContent, IonContent]
})
export class Tab2Page {

  constructor(private races:RacesServices) {}
  allRacesUpcoming:RaceModel[];

  ngOnInit(){
    this.getAllRacesUpcoming()
  }


  getAllRacesUpcoming(){
    this.races.getAllRacesUpcoming()
      .subscribe({
        next: ((res:RaceModel[])  => {
          console.log(res)
          this.allRacesUpcoming = res
        }),
        error: ((err)  => {
          console.log(err)
        })
      })
  }

}
