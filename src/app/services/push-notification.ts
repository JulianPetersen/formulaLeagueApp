import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { PushApiService } from './push-api-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private api: PushApiService, private router: Router) { }

  async init() {
    const permStatus = await PushNotifications.requestPermissions();

    if (permStatus.receive !== 'granted') return;

    await PushNotifications.register();

    PushNotifications.addListener('registration', token => {
      console.log('TOKEN:', token.value);

      // 🔥 guardar en backend
      this.api.saveToken(token.value).subscribe();
    });

    PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push recibido:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', action => {
      console.log('FULL ACTION:', action);
      this.processPayload(action.notification?.data)
    });
  }


  processPayload(payload) {
    if (payload.topic == 'news') {
      if (payload.slug) {
        console.log('HAY SLUG', payload.slug)
        this.router.navigateByUrl(`/tabs/news-detail/${payload.slug}`)
      } else {
        console.log('NO HAY SLUG')
        this.router.navigateByUrl('/tabs/news')
      }
    }
  }

}

