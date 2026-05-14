import { Injectable } from '@angular/core';
import { AdMob } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {

  async initialize() {
    await AdMob.initialize();
  }

  async showInterstitial() {

    const options = {
      adId: 'ca-app-pub-7377639735677577/7582767693' // TEST ID
    };

    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();

  }

}