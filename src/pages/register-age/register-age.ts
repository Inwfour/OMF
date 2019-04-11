import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
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
    private toastCtrl: ToastController,
    private loadingCtrl : LoadingController,
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
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
    })
    loader.present();

    this.fireinfo.doc(firebase.auth().currentUser.uid).update({
      age: this.age
    }).then(() => {
      this.toastCtrl.create({
        message: "บันทึกอายุสำเร็จ",
        duration: 3000,
        position: 'top'
      }).present();
      loader.dismiss();
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
