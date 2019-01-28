import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { User } from '../../models/user';
import firebase from 'firebase';
import { LoginPage } from '../login/login';
import { ImageProvider } from '../../providers/image/image';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { UploadImgProvider } from '../../providers/upload-img/upload-img';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: User = new User;
  image: string = "assets/imgs/user.png";
  _uid:any;
  url:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public _IMG: ImageProvider,
    public _LOADER: PreloaderProvider,
    public _UPIMG: UploadImgProvider,
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
  

  save() {
    this._LOADER.displayPreloader();

    firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(async () => {
        if (this.image != "assets/imgs/user.png") {
          await this._UPIMG.uploadImgProfile(this.user.name,this.image)
          .then((data) => {
              this.url = data;
          });
        }
        var newUser = firebase.auth().currentUser;
        newUser.updateProfile({
          displayName: this.user.name,
          photoURL: this.url
        }).then(() => {
        }).catch((err) => {
        })
        firebase.firestore().collection("informationUser").add({
          photoURL: firebase.auth().currentUser.photoURL,
          owner_name: this.user.name,
          owner: firebase.auth().currentUser.uid,
          email: firebase.auth().currentUser.email,
          created: firebase.firestore.FieldValue.serverTimestamp()
        }).then((data) => {
          console.log(data.id);
        }).catch((err) => {
          console.log(err);
        })
        this._LOADER.hidePreloader();
        this.navCtrl.setRoot(LoginPage);
      }).catch((err) => {
        this._LOADER.hidePreloader();
        console.log(err);
      })
  }



}
