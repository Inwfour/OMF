import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController,ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { DbServiceProvider } from '../../providers/db-service/db-service';
import firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = new User;
  constructor(private serviceAuth: AuthServiceProvider,
    private serviceData: DbServiceProvider,
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl:AlertController,
    public toastCtrl:ToastController
  ) {
  }

  //Set Emtry String
  ionViewWillEnter() {
    this.user.email = "";
    this.user.password = "";
  }

  //Login Service
  login() {

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
      
    });
  
    loader.present();

    firebase.auth().signInWithEmailAndPassword(this.user.email,this.user.password).then((data) => {
      loader.dismiss();
      console.log(data);
      this.navCtrl.setRoot(TabsPage);
    }).catch((err) => {
      loader.dismiss();
      this.toastCtrl.create({
        message: err.message,
        duration: 3000
      }).present();
    })
  }

  //   this.serviceAuth.singinUser(user)
  //   .then(res => {
  //     loader.dismiss();
  //     this.navCtrl.setRoot(TabsPage);

  //   }, error => {
  //     loader.dismiss();

  //     alert(error);
  //   })
  // }

  // nextHome() {
  //   try {
  //     const result = this.afAuth.auth.signInWithEmailAndPassword(this.user.email + "@domain.xta", this.user.password)
  //       .then(data => {
  //         this.service.user.uid = this.afAuth.auth.currentUser.uid;
  //         this.navCtrl.push(HomePage);
  //         console.log(this.service.user);

  //       });
  //   } catch (e) {
  //     alert("รหัสไม่ถูกต้อง");
  //   }
  // }

  // getCurrentUser() {
  //   this.afAuth.authState.subscribe(data => {
  //     console.log(data);
  //   })
  // }

  nextRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
