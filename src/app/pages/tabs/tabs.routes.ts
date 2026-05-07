import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from 'src/app/guards/auth-guard';
import { OnboardingGuard } from 'src/app/guards/onboarding-guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
        canActivate: [OnboardingGuard]
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'myaccount',
        loadComponent: () => import('../myaccount/myaccount.page').then(m => m.MyaccountPage)
      },
      {
        path: 'my-prediction',
        loadComponent: () => import('../my-prediction/my-prediction.page').then(m => m.MyPredictionPage)
      },
      {
        path: 'user-ranking',
        loadComponent: () => import('../user-ranking/user-ranking.page').then(m => m.UserRankingPage)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
      {
        path: 'news',
        loadComponent: () => import('../news/news.page').then(m => m.NewsPage)
      },
      {
        path: 'ranking-pilots',
        loadComponent: () => import('../ranking-pilots/ranking-pilots.page').then(m => m.RankingPilotsPage)
      },


      {
        path: 'news-detail/:slug',
        loadComponent: () =>
          import('../news-detail/news-detail.page')
            .then(m => m.NewsDetailPage)
      },
      {
        path: 'game-semaforo',
        loadComponent: () => import('../game-semaforo/game-semaforo.page').then(m => m.GameSemaforoPage)
      },
    ],
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
