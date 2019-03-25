import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { RegisterPage } from '../register/register';
import { UserProvider } from '../../providers/user/user';
import { PasswordresetPage } from '../passwordreset/passwordreset';
import { RegisterPhotoPage } from '../register-photo/register-photo';
import { LoginProvider } from '../../providers/login/login';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = new User;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public _USER: UserProvider,
    private loginservice: LoginProvider,
  ) {
  }

  //Set Emtry String
  ionViewWillEnter() {
    this.user.email = "";
    this.user.password = "";
  }

  //Login Service
  login(user) {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
    })
    loader.present();

    this.loginservice.loginUser(user).then((data) => {
      console.log(data);
      loader.dismiss();
      this.toastCtrl.create({
        message: "เข้าสู่ระบบสำเร็จ",
        duration: 3000,
        position: 'top',
      }).present();
      this.navCtrl.push(RegisterPhotoPage);
    }).catch((err) => {
      console.log(err);
      loader.dismiss();
      this.toastCtrl.create({
        message: "กรุณากรอกชื่อผู้ใช้หรือรหัสผ่านให้ถูกต้อง",
        duration: 3000,
        position: 'top',
      }).present();
    })

  }

  nextRegister() {
    this.navCtrl.push(RegisterPage);
  }

  passwordreset() {
    this.navCtrl.push(PasswordresetPage);
  }

}
