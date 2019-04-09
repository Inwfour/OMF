import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-settingsalarm',
  templateUrl: 'settingsalarm.html',
})
export class SettingsalarmPage {
  selecttype:any = 'eat';
  myTime:any = new Date().getTime();
  bangkokTime:string;
  number:any;
  name:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl : ToastController
    ) {
      this.bangkokTime = moment().format();
  }
  
  savemedicine() {
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
      this.toastCtrl.create({
        message: "บันทึกแจ้งเตือนสำเร็จ",
        duration: 2000,
        position: 'top',
      }).present();
      this.viewCtrl.dismiss();
    })
  
  }
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
