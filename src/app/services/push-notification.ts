import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { PushApiService } from './push-api-service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private api: PushApiService) {}

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
      console.log('Click en notificación:', action);
    });
  }
}