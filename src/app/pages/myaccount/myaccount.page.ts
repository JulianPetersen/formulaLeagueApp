import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonCard,IonCardContent,IonButton } from '@ionic/angular/standalone';
import { UsersService } from 'src/app/services/users';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service';
import { GlobalService } from 'src/app/services/global';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule,IonCard,IonCardContent,IonButton]
})
export class MyaccountPage implements OnInit {

  constructor(private userService:UsersService, private auth:AuthService, private global:GlobalService) { }

  ngOnInit() {
    this.getInfoUSer()
  }


  user:User;


getInfoUSer(){
  this.userService.getInfoUser()
    .subscribe({
      next: ((res:User)=> {
        this.user = res;
        console.log(res)
      }),
      error: (err) => {
        if(err.status == 401){
            this.global.presentConfirmAlert('ATENCION', "", "se venció la sesion, debe iniciar sesion nuevamente", ()=>{
              this.auth.logout();
            })
          }
      }
    })
}



logout(){
  this.auth.logout()
}
}
