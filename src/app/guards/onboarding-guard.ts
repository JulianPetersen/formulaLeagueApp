import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    const seen = localStorage.getItem('onboarding_seen');

    if (!seen) {
      this.router.navigateByUrl('/onboarding',{ replaceUrl: true });
      return false;
    }

    return true;
  }

}