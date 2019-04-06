import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SettingsalarmPage } from '../settingsalarm/settingsalarm';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-settingallalarm',
  templateUrl: 'settingallalarm.html',
})
export class SettingallalarmPage {
  alarm:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController
    ) {
  }

  ionViewWillEnter() {
    this.getmedicine(); 
  }

  getmedicine() {
    firebase.firestore().collection("medicine").where("uid", "==" , firebase.auth().currentUser.uid).orderBy("timestamp", "desc").get().then((docs) => {
        docs.forEach((doc) => {
          console.log(doc);
          this.alarm.push(doc);
          console.log(this.alarm);
        })
    })  
  }

  modalalarm() {
    this.modalCtrl.create(SettingsalarmPage).present();
    this.modalCtrl.create(SettingsalarmPage).onDidDismiss(() => {
      this.getmedicine();
    })
  }

}
