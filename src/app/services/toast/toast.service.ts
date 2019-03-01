import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController,
  ) { }

  async present(message = "Acknowledged.", duration?) {
    let toast_duration = '';
    if (duration) {
      toast_duration = duration;
    } else {
      toast_duration = 0;
    }
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      duration: toast_duration,
      position: 'top',
      closeButtonText: 'OK'
    });
    toast.present();
  }

}
