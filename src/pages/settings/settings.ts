import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import firebase from 'firebase';
import { SettingsalarmPage } from '../settingsalarm/settingsalarm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { Autostart } from '@ionic-native/autostart';
import { AboutPage } from '../about/about';
import { SettingallalarmPage } from '../settingallalarm/settingallalarm';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  fireinfo = firebase.firestore().collection('informationUser');
  disease:any = [];
  checked:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private localNotifications: LocalNotifications,
    public storage: Storage,
    private autostart: Autostart,
    public platform: Platform
    ) {
  }

  ionViewDidEnter() {

  
      this.fireinfo.doc(firebase.auth().currentUser.uid).get().then((res) => {
      this.disease = res.data().disease;
      console.log(this.disease);
    })
  }

  test() {
    this.platform.ready().then(() => {
      this.localNotifications.schedule({
        id: 1,
        title: "ทดสอบ",
        text: "ทำไมไม่ได้ล่ะ",
        trigger: {at: new Date(new Date().getTime() + 10000)},
        data: {"id":1, "name": "Four"}
      });
    });
  }

  about() {
    this.navCtrl.push(AboutPage);
  }
  settingalarm() {
    this.navCtrl.push(SettingallalarmPage);
  }

}
