import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AdMob,
  RewardAdOptions,
  RewardAdPluginEvents,
  AdmobConsentStatus
} from '@capacitor-community/admob';
import { GlobalService } from './global';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {


  constructor(private http:HttpClient,private global:GlobalService){

  }
  getToken(): string | null {
    return localStorage.getItem('tokenApp');
  }
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


  async showRewardVideo(): Promise<boolean> {

  return new Promise(async (resolve, reject) => {

    try {

      const options: RewardAdOptions = {

        adId: 'ca-app-pub-7377639735677577/6759762301',
        // isTesting: true
      };

      await AdMob.prepareRewardVideoAd(options);

      // reward obtenido
      const rewardListener = await AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        () => {

          console.log('reward obtenido');

          rewardListener.remove();
          dismissListener.remove();
          failListener.remove();

          resolve(true);
        }
      );

      // anuncio cerrado
      const dismissListener = await AdMob.addListener(
        RewardAdPluginEvents.Dismissed,
        () => {

          console.log('ad cerrado');

          rewardListener.remove();
          dismissListener.remove();
          failListener.remove();
        }
      );

      // error
      const failListener = await AdMob.addListener(
        RewardAdPluginEvents.FailedToLoad,
        (error) => {

          console.log(error);

          rewardListener.remove();
          dismissListener.remove();
          failListener.remove();

          reject(error);
        }
      );

      await AdMob.showRewardVideoAd();

    } catch (error) {

      console.log(error);

      reject(error);
    }
  });
}

rewardAd() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
  return this.http.post(
    `${this.global.api}/api/reward-ad`,
    {},
    {headers}
  );
}


getRewardStatus() {

  const token = this.getToken();

  const headers = new HttpHeaders({
    authorization: `Bearer ${token}`
  });

  return this.http.get(
    `${this.global.api}/api/reward-ad/reward-status`,
    { headers }
  );
}

}