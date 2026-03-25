  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { IonContent, IonHeader, IonTitle, IonToolbar,IonCard,IonCardContent,IonButtons,IonBackButton } from '@ionic/angular/standalone';
  import { ActivatedRoute } from '@angular/router';
  import { NewsServices } from 'src/app/services/news-services';
  import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
  @Component({
    selector: 'app-news-detail',
    templateUrl: './news-detail.page.html',
    styleUrls: ['./news-detail.page.scss'],
    standalone: true,
    imports: [IonContent, CommonModule, FormsModule,IonCard,IonCardContent,IonHeader,IonToolbar,IonTitle,IonButtons,IonBackButton]
  })
  export class NewsDetailPage implements OnInit {

    news: any;

    constructor(
      private route: ActivatedRoute,
      private newsService: NewsServices
    ) {}

    ngOnInit() {

      const slug = this.route.snapshot.paramMap.get('slug');
      console.log('el slug es', slug)
      if(slug){
        this.getNews(slug);
      }

    }


      ionViewDidEnter() {
    this.showBanner();
  }

  ionViewWillLeave() {
    this.hideBanner();
  }



    getNews(slug:string){

      this.newsService.getNewsBySlug(slug)
        .subscribe((res:any)=>{

          this.news = res;

        });

    }



    async showBanner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-3940256099942544/6300978111',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      isTesting: true
    };

    await AdMob.showBanner(options);
  }

  async hideBanner() {
    await AdMob.hideBanner();
  }
  }
