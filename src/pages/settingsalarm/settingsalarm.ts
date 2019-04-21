import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, Platform } from 'ionic-angular';
import firebase from 'firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-settingsalarm',
  templateUrl: 'settingsalarm.html',
})
export class SettingsalarmPage {
  selecttype:any = 'eat';
  bangkokTime:string;
  number:any;
  name:any;
  type:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl : ToastController,
    public localNotifications : LocalNotifications,
    public platform: Platform,
    ) {
      this.bangkokTime = moment().format();
  }
  
  savemedicine() {
    if(this.selecttype == "eat"){
      this.type = "สำหรับรับประทาน"
    }else {
      this.type = "สำหรับฉีด"
    }
    if(this.name == undefined || this.number == undefined){
      this.toastCtrl.create({
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        duration: 2000,
        position: 'top',
      }).present();
  }else{
    firebase.firestore().collection("medicine").add({
      uid: firebase.auth().currentUser.uid,
      name: this.name,
      number: this.number,
      time: this.bangkokTime,
      type: this.selecttype,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      this.localNotifications.schedule({
        title: "ชื่อยา : " + this.name,
        text: "ประเภท : " + this.type + ", จำนวน : " + this.number,
        trigger: {at: new Date(this.bangkokTime)},
        led: 'FF0000',
        sound: this.setSound()
     });

      this.toastCtrl.create({
        message: "บันทึกแจ้งเตือนสำเร็จ",
        duration: 2000,
        position: 'top',
      }).present();
      this.viewCtrl.dismiss();
    })
  }
  }

  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/sound/alarm.mp3'
    } else {
      return 'file://assets/sound/alarm.mp3'
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
