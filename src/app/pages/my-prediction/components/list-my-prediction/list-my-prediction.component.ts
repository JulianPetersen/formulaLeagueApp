import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
@Component({
  selector: 'app-list-my-prediction',
  templateUrl: './list-my-prediction.component.html',
  styleUrls: ['./list-my-prediction.component.scss'],
  imports:[CommonModule,IonContent]
})
export class ListMyPredictionComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @Input() predictions: any[] = [];

  trackById(index: number, item: any) {
    return item._id;
  }
}
