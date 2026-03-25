import { Component, EnvironmentInjector, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent,IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { speedometer,flag,podium,person,gift,newspaper } from 'ionicons/icons';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service';
import { GlobalService } from 'src/app/services/global';
import { UsersService } from 'src/app/services/users';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, IonIcon,RouterModule],
})
export class Tab3Page {
    public environmentInjector = inject(EnvironmentInjector);

  constructor(private auth:AuthService, private user:UsersService, private global:GlobalService) {
    addIcons({ speedometer,flag,podium,person,gift,newspaper});
  }

  userInfo:User;


  ngOnInit(){
    this.getInfoUser()
  }

  logout(){
    this.global.presentConfirmAlert('ATENCION', '','¿Estas seguro que quieres cerrar sesion?', ()=>{
      this.auth.logout()
    })
  }


  getInfoUser(){
    this.user.getInfoUser()
      .subscribe ((res:User) => {
        this.userInfo = res
        console.log(this.userInfo)
      })
  }
}
