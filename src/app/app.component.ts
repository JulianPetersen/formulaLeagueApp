import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, } from '@ionic/angular/standalone';
import { PushService } from './services/push-notification';
import { App } from '@capacitor/app';
import { AppversionService } from './services/appversion-service';
import { VersionAppModel } from './models/version-app';
import { Browser } from '@capacitor/browser';
import { compare } from 'compare-versions';
import { AlertController } from '@ionic/angular';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  constructor(
    private pushService: PushService,
    private versionApp: AppversionService,
    private alertController: AlertController

  ) { }

  async ngOnInit() {

    setTimeout(() => {
      this.pushService.init();
    }, 2000);

    this.getLatestVersionApp();

    await GoogleSignIn.initialize({
      clientId: '56438973951-n0j2puj0fiav8104vggpoim9i116j9e0.apps.googleusercontent.com',
    });
  }

  async checkInfo(): Promise<string> {


    const info = await App.getInfo();

    console.log('La versión instalada es:', info.version);

    return info.version;
  }

  async getLatestVersionApp() {

    console.log('METODO DE VERSIONADO');

    this.versionApp.getLatestVersion()
      .subscribe({

        next: async (res: VersionAppModel) => {

          console.log('RESPUESTA COMPLETA');
          console.log(JSON.stringify(res));

          const latestVersion = res.latestVersion;

          console.log('VERSION backend:', latestVersion);

          const actualVersion = await this.checkInfo();

          console.log('VERSION instalada:', actualVersion);

          if (compare(actualVersion, latestVersion, '<')) {

            const alert = await this.alertController.create({
              header: 'Nueva actualización',
              message: 'Hay una nueva versión disponible 🚀',
              backdropDismiss: false,
              buttons: [
                {
                  text: 'Actualizar',
                  handler: async () => {

                    await Browser.open({
                      url: 'https://play.google.com/store/apps/details?id=com.frigg.formulaleague2'
                    });

                  }
                }
              ]
            });

            await alert.present();

          }

          else if (compare(actualVersion, latestVersion, '=')) {

            console.log('La app está actualizada');

          }

          else if (compare(actualVersion, latestVersion, '>')) {

            console.log('La app es más nueva que backend');

          }

        },

        error: (err) => {
          console.log(err);
        }

      });
  }
}