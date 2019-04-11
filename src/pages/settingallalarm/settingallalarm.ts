import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { SettingsalarmPage } from '../settingsalarm/settingsalarm';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-settingallalarm',
  templateUrl: 'settingallalarm.html',
})
export class SettingallalarmPage {
  alarm:any = [];
  datealarm:string = new Date().toISOString();
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl : AlertController,
    ) {
  }

  ionViewWillEnter() {
    this.getmedicine(); 
  }

  getmedicine() {
    firebase.firestore().collection("medicine").where("uid", "==" , firebase.auth().currentUser.uid).orderBy("timestamp", "desc").get().then((docs) => {
        docs.forEach((doc) => {
          console.log(doc.data().time);
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

  delete(item) {
    let alert = this.alertCtrl.create({
      title : "คุณต้องการลบ : " + item.data().name + " ?",
      buttons : [
        {
          text: "กลับ",
          handler: () => {
            console.log("ไม่ได้ลบข้อมูล");
          }
        },
        {
          text: "ยืนยัน",
          handler: () => {
            firebase.firestore().collection("mecidine").doc(item.id).delete().then(() => {
              this.getmedicine();
            })
          }
        },
      ]
    })
    alert.present();
  }

}
