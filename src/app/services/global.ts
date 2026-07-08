import { Injectable } from '@angular/core';
import { AlertController, IonButton } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
  
})
export class GlobalService {

  //dev
  public api = 'http://localhost:4000';
  //prod
  // public api =' https://formulaleague.site'

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




  async presentConfirmAlert(
  header: string,
  subheader: string,
  message: string,
  onConfirm: () => Promise<void> | void
) {
  const alert = await this.alertController.create({
    header,
    subHeader: subheader,
    message,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'OK',
        handler: async () => {
          await onConfirm();
        }
      }
    ]
  });

  await alert.present();
}

}



