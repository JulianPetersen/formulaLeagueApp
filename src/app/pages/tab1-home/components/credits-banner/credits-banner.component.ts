import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonButton,
  IonLabel,
  IonReorder,
  IonReorderGroup,
  IonAvatar
} from '@ionic/angular/standalone';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users';
@Component({
  selector: 'app-credits-banner',
  templateUrl: './credits-banner.component.html',
  styleUrls: ['./credits-banner.component.scss'],
  imports:[IonButton],
})
export class CreditsBannerComponent  implements OnInit {


  userData:User
  credits:number
  points:number
  constructor(private userService:UsersService, private router:Router) { }

  ngOnInit() {
    this.getUserData()
  }


    getUserData(){
    this.userService.getInfoUser()
      .subscribe({
        next: ((res)=>{
          this.userData = res;

        }),
        error: ((err) => {
          console.log(err)
        })
      })
  }


  getdataUser(){
    this.userService.getInfoUser()
      .subscribe({
         next: ((res)=>{
          
          console.log('dataUser',res)
        }),
        error: ((err) => {
          console.log(err)
        })
      })
  }


  goToGetCredits(){
    this.router.navigateByUrl('tabs/credits-page')
  }

}




