import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { User } from '../../models/user';
import firebase from 'firebase';
import { LoginPage } from '../login/login';
import { ImageProvider } from '../../providers/image/image';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: User = new User;
  image: string = "assets/imgs/user.png";
  _uid: any;
  url: any="";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public _IMG: ImageProvider,
    public _LOADER: PreloaderProvider,
    public _USER: UserProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
  }

  changeProfilePicture() {
    let alert = this.actionSheetCtrl.create({
      title: "คุณต้องการรูปในลักษณะใด ?",
      buttons: [
        {
          text: "กล้องถ่ายรูป",
          handler: () => {
            this._IMG.camera().then(data => {
              this.image = data;
            })
          }
        },
        {
          text: "เลือกจากอัลบั้มรูปภาพ",
          handler: () => {
            this._IMG.selectImage().then(data => {
              this.image = data;
            })
          }
        },
        {
          text: "กลับ",
          handler: () => {
            console.log("ไม่ได้ลบข้อมูล");
          }
        }
      ]
    });
    alert.present();
  }


  save(user) {
    // this._LOADER.displayPreloader();
    // let loader= this.loadingCtrl.create({
    //   spinner: 'hide',
    //   content: `<img src="assets/imgs/loading.svg">`

    // }); loader.present();

    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(async () => {
        if (this.image != "assets/imgs/user.png") {
          await this._USER.uploadImgUser(firebase.auth().currentUser.uid, this.image)
            .then((data) => {
              this.url = data;
            });
        }
          var newUser = firebase.auth().currentUser;
          var newInformationUser = firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid);
         newUser.updateProfile({
          displayName: user.name,
          photoURL: this.url
        }).then(() => {
          
          newInformationUser.set({
            photoURL: this.url,
            owner_name: user.name,
            owner: firebase.auth().currentUser.uid,
            email: firebase.auth().currentUser.email,
            created: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            // loader.dismiss();
            console.log("Success !!!");
            this.navCtrl.setRoot(LoginPage);
          }).catch((err) => {
            });
        }).catch((err) => {
          console.log(err);
        })

      })
    }
}
