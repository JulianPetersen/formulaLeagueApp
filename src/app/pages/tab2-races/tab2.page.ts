import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent , IonCard, IonCardContent} from '@ionic/angular/standalone';
import { RaceModel } from 'src/app/models/race-model';
import { RacesServices } from 'src/app/services/races-services';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GlobalService } from 'src/app/services/global';
import { AuthService } from 'src/app/services/auth-service';




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [CommonModule, IonCard, IonCardContent, IonContent]
})
export class Tab2Page {

  constructor(private races:RacesServices,private global:GlobalService,private auth:AuthService) {}
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
        error: (err) => {
          if (err.status == 401) {
            this.global.presentConfirmAlert('ATENCION', "", "se venció la sesion, debe iniciar sesion nuevamente", () => {
              this.auth.logout();
            })
          }
        }

      })
  }

}
