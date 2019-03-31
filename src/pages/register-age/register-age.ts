import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RegisterPhonePage } from '../register-phone/register-phone';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-register-age',
  templateUrl: 'register-age.html',
})
export class RegisterAgePage {
  fireinfo = firebase.firestore().collection('informationUser');
  age:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController
    ) {
      this.fireinfo.doc(firebase.auth().currentUser.uid).get().then((res) => {
        if(res.data().age === undefined) {
          this.age = "";
        }else {
          this.age = res.data().age;
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterAgePage');
  }

  back() {
    this.navCtrl.pop();
  }

  next(){
    if(this.age === "" || this.age === null || this.age === undefined){
      this.toastCtrl.create({
        message: "กรุณาระบุอายุที่ถูกต้อง",
        duration: 3000,
        position: 'top'
      }).present();
  } else {
    this.fireinfo.doc(firebase.auth().currentUser.uid).update({
      age: this.age
    }).then(() => {
      this.toastCtrl.create({
        message: "บันทึกอายุสำเร็จ",
        duration: 3000,
        position: 'top'
      }).present();
      this.navCtrl.push(RegisterPhonePage);
    }).catch((err) => {
      console.log(err);
      this.toastCtrl.create({
        message: "บันทึกอายุไม่สำเร็จ",
        duration: 3000,
        position: 'top'
      }).present();
    })
  }
}

}
