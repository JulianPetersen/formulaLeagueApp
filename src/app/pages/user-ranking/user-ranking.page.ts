import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonRefresher,IonRefresherContent} from '@ionic/angular/standalone';
import { UsersService } from 'src/app/services/users';
import { GlobalService } from 'src/app/services/global';
import { RefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-user-ranking',
  templateUrl: './user-ranking.page.html',
  styleUrls: ['./user-ranking.page.scss'],
  standalone: true,
  imports: [IonContent,CommonModule, FormsModule,IonRefresher,IonRefresherContent]
})
export class UserRankingPage implements OnInit {

topUsers: any[] = [];
currentUserId: string;

constructor(private usersService: UsersService,
            private global: GlobalService) {}



ngOnInit() {
 this.getTopUsers()


}


getTopUsers(){
  this.usersService.getTopUsers()
    .subscribe({
      next: ((res:any) => {
        console.log(res)
        this.topUsers = res 
      })
    })
}

    handleRefresh(event: RefresherCustomEvent) {
     this.getTopUsers()
        
      event.target.complete();
    
      
    }
}
