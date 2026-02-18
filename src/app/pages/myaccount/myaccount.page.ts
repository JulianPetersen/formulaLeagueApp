import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonCard,IonCardContent,IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule,IonCard,IonCardContent,IonButton]
})
export class MyaccountPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  user = {
  name: 'Julian',
  email: 'test@test.com',
  role: 'user',
  points: 12,
  createdAt: new Date()
};


logout(){

}
}
