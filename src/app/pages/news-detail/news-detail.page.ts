import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonIcon ,IonCard, IonCardContent, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NewsServices } from 'src/app/services/news-services';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Share } from '@capacitor/share';
import { addIcons } from 'ionicons';
import { trophy,flashOutline,shareOutline,shareSocial } from 'ionicons/icons';
import { AdmobService } from 'src/app/services/admob-service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard,IonIcon, IonCardContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton]
})
export class NewsDetailPage implements OnInit {

  news: any;
 
  constructor(
    private route: ActivatedRoute,
    private newsService: NewsServices,
    private admob:AdmobService
  ) { 

    addIcons({ trophy,flashOutline,shareOutline,shareSocial });
  }

  async ngOnInit() {
    await AdMob.initialize({});
  }

  ionViewWillEnter() {
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log('el slug es', slug)
    if (slug) {
      this.getNews(slug);
    }
    this.showAddperViews()
   
  }


  ionViewDidEnter() {
    setTimeout(async () => {
      await this.showBanner();
    }, 500);
  }

  ionViewWillLeave() {
    this.hideBanner();
  }


  getNews(slug: string) {

    this.newsService.getNewsBySlug(slug)
      .subscribe((res: any) => {

        this.news = res;

      });

  }

async shareNews() {

  if (!this.news) return;

  await Share.share({
    title: this.news.title,
    text: this.news.summary,
    url: `https://formulaleague.site/news/${this.news.slug}`,
    dialogTitle: 'Compartir noticia'
  });

}

  async showBanner() {
    await AdMob.removeBanner(); // limpia por si quedó alguno

    const options: BannerAdOptions = {
      adId: 'ca-app-pub-7377639735677577/2604554594',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      isTesting: false
    };

    await AdMob.showBanner(options);
  }

  async hideBanner() {
    await AdMob.removeBanner();
  }


showAddperViews(){
    let cuantitiAdd = parseInt(localStorage.getItem('newsAdd')) 
    if(cuantitiAdd) {
      cuantitiAdd = cuantitiAdd + 1
      localStorage.setItem("newsAdd", cuantitiAdd.toString())
      if(cuantitiAdd == 5){
        localStorage.setItem('newsAdd',"0")
        this.admob.showInterstitial()
      } 
    }else{
      localStorage.setItem("newsAdd",'1')
    }
  }
}
