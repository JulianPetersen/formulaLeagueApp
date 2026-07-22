import { Component, EnvironmentInjector, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward, flag, logOut, newspaper, person, podium, ticket } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth-service';
import { GlobalService } from 'src/app/services/global';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, IonIcon, RouterModule],
})
export class Tab3Page {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
    private auth: AuthService,
    private global: GlobalService
  ) {
    addIcons({ chevronForward, flag, logOut, newspaper, person, podium, ticket });
  }

  logout() {
    this.global.presentConfirmAlert('ATENCION', '', 'Estas seguro que quieres cerrar sesion?', () => {
      this.auth.logout();
    });
  }
}
