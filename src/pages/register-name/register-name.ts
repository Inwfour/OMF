import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { RegisterAgePage } from '../register-age/register-age';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-register-name',
  templateUrl: 'register-name.html',
})
export class RegisterNamePage {
  fireinfo = firebase.firestore().collection('informationUser');
  displayname:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl : ToastController,
    private loadingCtrl : LoadingController,
    ) {
      this.fireinfo.doc(firebase.auth().currentUser.uid).get().then((res) => {
        if(res.data().owner_name === undefined) {
          this.displayname = "";
        }else {
          this.displayname = res.data().owner_name;
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterNamePage');
  }

  back() {
    this.navCtrl.pop();
  }

  next(){

    if(this.displayname === "" || this.displayname === null || this.displayname === undefined){
      this.toastCtrl.create({
        message: "กรุณาระบุชื่อเล่นที่ถูกต้อง",
        duration: 3000,
        position: 'top'
      }).present();
  } else {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
    })
    loader.present();

    firebase.auth().currentUser.updateProfile({
      photoURL: firebase.auth().currentUser.photoURL,
      displayName: this.displayname
    }).then(() => {
      this.fireinfo.doc(firebase.auth().currentUser.uid).update({
        owner_name: this.displayname
      }).then(() => {
        this.toastCtrl.create({
          message: "บันทึกชื่อเล่นสำเร็จ",
          duration: 3000,
          position: 'top'
        }).present();
        loader.dismiss();
        this.navCtrl.push(RegisterAgePage);
      }).catch((err) => {
        console.log(err);
        this.toastCtrl.create({
          message: "บันทึกชื่อเล่นไม่สำเร็จ",
          duration: 3000,
          position: 'top'
        }).present();
      })
    }).catch((err) => {
      console.log(err);
      this.toastCtrl.create({
        message: "บันทึกชื่อเล่นไม่สำเร็จ",
        duration: 3000,
        position: 'top'
      }).present();
    })
  }
}

}
