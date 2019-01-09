import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,AlertController,ToastController } from 'ionic-angular';
import { User } from '../../models/user';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: User = new User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl:AlertController,
    public toastCtrl:ToastController
  ) {
  }

  save() {

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
      
    });
  
    loader.present();

    firebase.auth().createUserWithEmailAndPassword(this.user.email,this.user.password).then((data) => {
      loader.dismiss();
      console.log(data);

      let newUser : firebase.User = data.user;
      newUser.updateProfile({
        displayName: this.user.name,
        photoURL: ""
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        loader.dismiss();
        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).present();
      })
    }).catch((err) => {
      loader.dismiss();
      this.toastCtrl.create({
        message: err.message,
        duration: 3000
      }).present();
    })

    // this.serviceAuth.signupUser(user)
    //   .then((res) => {

    //     // this.user.uid = this.afAuth.auth.currentUser.uid;
    //     this.serviceData.dbUser(user).set(user);
    //     this.navCtrl.setRoot(LoginPage);
    //     loader.dismiss();

    //   }, error => {
    //     loader.dismiss();
    //     alert(error);
    //   });
  }


  // addItem(user:User){
  //   this.testuser.addItem(user).then(ref => {
  //     console.log(ref.key);
  //   });
  // }

}
