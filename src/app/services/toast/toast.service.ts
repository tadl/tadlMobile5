import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController,
  ) { }

  async present(message = "Acknowledged.") {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      duration: 4000,
      position: 'top',
      closeButtonText: 'OK'
    });
    toast.present();
  }

}
