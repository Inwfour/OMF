import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import firebase from 'firebase';
import { RegisterProvider } from '../../providers/register/register';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  fireinfo = firebase.firestore().collection('informationUser');
  user: User = new User;
  _uid: any;
  url: any = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    private registerService: RegisterProvider,
  ) {
  }

  save(user) {
    this.registerService.SaveUser(user).then(async (data) => {
      user.email = "";
      user.password = "";
      await this.fireinfo.doc(firebase.auth().currentUser.uid).set({
        owner: firebase.auth().currentUser.uid,
        email: firebase.auth().currentUser.email,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        console.log(data);
        this.toastCtrl.create({
          message: "บันทึกสำเร็จแล้ว",
          duration: 3000,
          position: 'top'
        }).present();
      })
      .catch((err) => {
        this.toastCtrl.create({
          message: "บันทึกข้อมูลไม่สำเร็จ",
          duration: 3000,
          position: 'top'
        }).present();
      });
    }).catch(() => {
      this.toastCtrl.create({
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        duration: 3000,
      }).present();
    })

  }

  back() {
    this.navCtrl.pop();
  }
}
