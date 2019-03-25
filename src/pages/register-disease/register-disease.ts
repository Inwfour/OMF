import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-register-disease',
  templateUrl: 'register-disease.html',
})
export class RegisterDiseasePage {
  fireinfo = firebase.firestore().collection('informationUser');
  disease:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl : ToastController
    ) {
      this.fireinfo.doc(firebase.auth().currentUser.uid).get().then((res) => {
        if(res.data().disease === undefined) {
          this.disease = [];
        }else {
          this.disease = res.data().disease;
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterDiseasePage');
  }

  back() {
    this.navCtrl.pop();
  }

  next(){
    this.fireinfo.doc(firebase.auth().currentUser.uid).update({
      disease: this.disease
    }).then(() => {
      this.toastCtrl.create({
        message: "บันทึกโรคประจำตัวสำเร็จ",
        duration: 3000,
        position: 'top'
      }).present();
      this.navCtrl.setRoot(TabsPage);
    }).catch((err) => {
      console.log(err);
      this.toastCtrl.create({
        message: "บันทึกโรคประจำตัวไม่สำเร็จ",
        duration: 3000,
        position: 'top'
      }).present();
    })
  }

}
