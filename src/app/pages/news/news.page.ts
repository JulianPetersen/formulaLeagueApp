import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { NewsServices } from 'src/app/services/news-services';
import { RouterModule } from '@angular/router';
import { GlobalService } from 'src/app/services/global';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonCardContent, IonInfiniteScroll, IonInfiniteScrollContent, RouterModule]
})
export class NewsPage implements OnInit {


  news: any[] = [];
  page = 1;
  limit = 10;

  constructor(private newsService: NewsServices,private global:GlobalService,private auth:AuthService) { }

  ngOnInit() {
    this.loadNews();
  }





  loadNews() {
    this.newsService.getNews(this.page, this.limit)
      .subscribe({
        next: ((res) => {
          console.log('las noticias son', res)
          this.news = [...this.news, ...res];
        }),
        error: (err) => {
          if (err.status == 401) {
            this.global.presentConfirmAlert('ATENCION', "", "se venció la sesion, debe iniciar sesion nuevamente", () => {
              this.auth.logout();
            })
          }
        }
      })
  }

  loadMore(event: any) {

    this.page++;

    this.newsService.getNews(this.page, this.limit)
      .subscribe((res: any) => {

        this.news = [...this.news, ...res];

        event.target.complete();

        if (res.length === 0) {
          event.target.disabled = true;
        }

      });

  }




}
