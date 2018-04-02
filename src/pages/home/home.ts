import { Component } from '@angular/core';
import { Platform, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private push: Push, public navCtrl: NavController, private alert: AlertController) {
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
          this.initPush();
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });
  }

  initPush() {
    const options: PushOptions = {
      android: {
        senderID: "427727259792"
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) =>
      {
        // we will add handler here.
          let alert = this.alert.create({
            title: 'New Notification',
            message: notification.message,
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'See',
                handler: () => {
                  this.navCtrl.parent.select(1);
                }
              }
            ]
          });
          alert.present();
      }
    );

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

}
