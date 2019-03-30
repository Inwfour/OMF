import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import firebase from 'firebase';
import { SettingsalarmPage } from '../settingsalarm/settingsalarm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';
import { Autostart } from '@ionic-native/autostart';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  fireinfo = firebase.firestore().collection('informationUser');
  disease:any = [];
  checked:any;
  disease0:boolean = false;
  disease1:boolean = false;
  disease2:boolean = false;
  disease3:boolean = false;
  disease4:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private localNotifications: LocalNotifications,
    public storage: Storage,
    private autostart: Autostart,
    public platform: Platform
    ) {
  }

  ionViewDidEnter() {
    // this.storage.get('disease0').then((val) => {
    //   if(val === null) {  
    //     this.storage.set('disease0', this.disease0);
    //   }
    //   if(val === false) {
    //     this.disease0 == val;
    //   }
    //   if(val === true) {
    //     this.disease0 == val;
    //   }
    // });
  
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

  // checkedAlarm() {
  //   if(this.disease0 === true) {
  //     this.storage.set('disease0', true);
  //     this.autostart.enable();
  //   this.localNotifications.schedule([
  //     {
  //       id: 1,
  //       title: 'My first notification',
  //       text: 'First notification test one',
  //       trigger: { every: {hour: 23, minute: 0} },
  //       data: {"id": 1, "name": "Mr. A"}
  //     },
  //     {
  //       id: 2,
  //       title: 'My Second notification',
  //       text: 'Second notification on 12 pm',
  //       trigger: { every: {hour: 22, minute: 59} },
  //       data: {"id": 2, "name": "Mr. B"}
  //     }
  //   ]);
  // }else {
  //   this.storage.set('disease0', false);
  //   this.localNotifications.clear(1).then((data) => {
  //       console.log("นำออกสำเร็จ" + JSON.stringify(data));
  //   })
  // }
  // }

  settingalarm() {
    this.navCtrl.push(SettingsalarmPage);
  }

}
