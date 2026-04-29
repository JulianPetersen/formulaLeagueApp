import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonSpinner, IonCard, IonInput, IonCardContent, IonItem } from '@ionic/angular/standalone';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users';
@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, FormsModule,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnBoardingComponent implements OnInit {

  username: string;
  infoUser:User;
  constructor(private router: Router, private userService: UsersService) { }



  ngOnInit() { 

    this.getInfoUser();
  }



  finish(){
     localStorage.setItem('onboarding_seen', 'true');
     this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }


  getInfoUser(){
    this.userService.getInfoUser()
      .subscribe((res:User) => {
        this.infoUser = res
        console.log('la infoUser es', res)
      })
  }


  addUserName() {
    console.log(this.username)
    this.userService.addUserName(this.username)
      .subscribe({
        next: ((res) => {
          console.log('usuario actualizado', res)
          localStorage.setItem('onboarding_seen', 'true');
          this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
        }),
        error: ((err) => {
          console.log(err)
        })
      })
  }
}
