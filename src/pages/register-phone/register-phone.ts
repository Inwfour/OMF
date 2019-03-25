import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RegisterDiseasePage } from '../register-disease/register-disease';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-register-phone',
  templateUrl: 'register-phone.html',
})
export class RegisterPhonePage {
  fireinfo = firebase.firestore().collection('informationUser');
  phone:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl : ToastController
    ) {
      this.fireinfo.doc(firebase.auth().currentUser.uid).get().then((res) => {
        if(res.data().phone === undefined) {
          this.phone = "";
        }else {
          this.phone = res.data().phone;
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPhonePage');
  }

  back() {
    this.navCtrl.pop();
  }

  next(){
    if(this.phone === "" || this.phone === null || this.phone === undefined){
      this.toastCtrl.create({
        message: "กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง",
        duration: 3000,
        position: 'top'
      }).present();
  } else {
    this.fireinfo.doc(firebase.auth().currentUser.uid).update({
      phone: this.phone
    }).then(() => {
      this.toastCtrl.create({
        message: "บันทึกเบอร์โทรศัพท์สำเร็จ",
        duration: 3000,
        position: 'top'
      }).present();
      this.navCtrl.push(RegisterDiseasePage);
    }).catch((err) => {
      console.log(err);
      this.toastCtrl.create({
        message: "บันทึกเบอร์โทรศัพท์ไม่สำเร็จ",
        duration: 3000,
        position: 'top'
      }).present();
    })
  }
}

}
