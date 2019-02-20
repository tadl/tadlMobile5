import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

/*  isLoading = false; */

  constructor(
    public loadingController: LoadingController,
  ) { }

  async present(message = "One moment...") {
    const loading = await this.loadingController.create({
      message: message,
    });
    return await loading.present().then(() => console.log('presented'));
  }

  async dismiss() {
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

}
