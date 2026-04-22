import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushService } from './services/push-notification';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
 constructor(private pushService: PushService) {

}

ngOnInit() {
  setTimeout(() => {
    this.pushService.init();
  }, 2000); // delay para no matar el arranque
}
}
