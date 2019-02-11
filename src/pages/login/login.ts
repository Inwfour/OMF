import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController,ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { RegisterPage } from '../register/register';
import firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';
import { SlideregisterPage } from '../slideregister/slideregister';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';


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
    public alertCtrl:AlertController,
    public toastCtrl:ToastController,
    public _USER : UserProvider
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

    firebase.auth().signInWithEmailAndPassword(this.user.email + "@omf.com",this.user.password).then((data) => {
      console.log(data);
      firebase.firestore().enableNetwork();
      firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid).get().then((res) => {
        let me = res;
        loader.dismiss();
        if(me.data().owner_name == "" || me.data().age == 0 || me.data().phone == 0){
          this.navCtrl.setRoot(SlideregisterPage);
        }else {
          this.navCtrl.setRoot(TabsPage);
        }
      })
    }).catch((err) => {
      loader.dismiss();
      this.toastCtrl.create({
        message: err.message,
        duration: 3000
      }).present();
    })
  }

  nextRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
