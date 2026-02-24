import { Component, EnvironmentInjector, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent,IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { speedometer,flag,podium,person,gift } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, IonIcon,RouterModule],
})
export class Tab3Page {
    public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ speedometer,flag,podium,person,gift});
  }



}
