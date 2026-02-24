import { Injectable } from '@angular/core';
import { AlertController, IonButton } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
  
})
export class GlobalService {
  public api = 'http://localhost:4000';

  constructor(private alertController: AlertController){

  }

  getUserId(){
    return localStorage.getItem('user')
  }


  async presentAlert(header:string,subheader:string,messagge:string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: messagge,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
