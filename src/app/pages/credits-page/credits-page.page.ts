import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { GlobalService } from 'src/app/services/global';
import { AdmobService } from 'src/app/services/admob-service';
import { UsersService } from 'src/app/services/users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credits-page',
  templateUrl: './credits-page.page.html',
  styleUrls: ['./credits-page.page.scss'],
  standalone: true,
 imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonSpinner
  ]
})
export class CreditsPagePage implements OnInit {

  userCredits:number = 0;

  adsViewedToday = 0;

  isLoading = false;

  constructor(
    private global: GlobalService,
    private admob: AdmobService,
    private userService:UsersService,
    private router:Router
  ) {}

  ngOnInit() {

    this.getUserCredits();

    // TEMPORAL
    // después viene del backend
    this.adsViewedToday = 0;
  }

  ionViewWillEnter() {

  this.loadRewardStatus();
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


 async watchAd() {

  if (this.adsViewedToday >= 5) {
    return;
  }

  this.isLoading = true;

  try {

    // mostrar rewarded
    await this.admob.showRewardVideo();

    // backend valida y suma
    this.admob.rewardAd()
      .subscribe({

        next: (res: any) => {

          // actualizar UI
          this.userCredits = res.credits;

          this.adsViewedToday = res.adsViewedToday;

          // actualizar global
          //this.global.setCredits(res.credits);

          this.global.presentAlert(
            'RM coin obtenida',
            '',
            'Ganaste 1 RM coin'
          );
        },

        error: (err) => {

          this.global.presentAlert(
            'Error',
            '',
            err.error.message
          );
        }
      });

  } catch (error) {

    this.global.presentAlert(
      'Error',
      '',
      'No se pudo mostrar el anuncio'
    );

  } finally {

    this.isLoading = false;
  }
}


loadRewardStatus() {

  this.admob.getRewardStatus()
    .subscribe({

      next: (res: any) => {
        console.log('viste anuncios', res)
        this.userCredits = res.credits;

        this.adsViewedToday = res.adsViewedToday;
      },

      error: (err) => {

        console.log(err);
      }
    });
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
}
