import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = 0;

  constructor(
    public loadingController: LoadingController,
  ) { }

  async present(message = "One moment...") {
    this.isLoading++;
    if (this.isLoading > 1) {
      this.dismiss();
    }
    return await this.loadingController.create({
      message: message,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
      });
    });
  }

  async dismiss() {
    this.isLoading--;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

}
