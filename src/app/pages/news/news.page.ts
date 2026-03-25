import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonCard,IonCardContent,IonInfiniteScroll,IonInfiniteScrollContent} from '@ionic/angular/standalone';
import { NewsServices } from 'src/app/services/news-services';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [IonContent,  CommonModule, FormsModule,IonCard,IonCardContent,IonInfiniteScroll,IonInfiniteScrollContent,RouterModule]
})
export class NewsPage implements OnInit {


  news: any[] = [];
  page = 1;
  limit = 10;

  constructor(private newsService: NewsServices) { }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {

    this.newsService.getNews(this.page, this.limit)
      .subscribe((res:any)=>{
        console.log('las noticias son',res)
        this.news = [...this.news, ...res];

      });

  }

  loadMore(event:any){

    this.page++;

    this.newsService.getNews(this.page, this.limit)
      .subscribe((res:any)=>{

        this.news = [...this.news, ...res];

        event.target.complete();

        if(res.length === 0){
          event.target.disabled = true;
        }

      });

  }




}
