import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { OnboardingGuard } from './guards/onboarding-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/on-boarding/on-boarding.component').then(m => m.OnBoardingComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'reset-passwrod',
    loadComponent: () => import('./pages/reset-passwrod/reset-passwrod.page').then( m => m.ResetPasswrodPage)
  },




];
