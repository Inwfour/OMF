import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController } from 'ionic-angular';
import { RegisterNamePage } from '../register-name/register-name';
import { ImageProvider } from '../../providers/image/image';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register-photo',
  templateUrl: 'register-photo.html',
})
export class RegisterPhotoPage {
  fireinfo = firebase.firestore().collection('informationUser');
  image:any = 'assets/imgs/user.png';
  uid:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public _IMG: ImageProvider,
    private userservice: UserProvider,
    private toastCtrl : ToastController,
    ) {
      this.uid = firebase.auth().currentUser.uid;
      // this.fireinfo.doc(firebase.auth().currentUser.uid).get().then((res) => {
      //   if(res.data().photoURL === undefined) {
      //     this.image = 'assets/imgs/user.png';
      //   }else {
      //     this.image = res.data().photoURL;
      //   }
      // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPhotoPage');
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

  back() {
    firebase.auth().signOut().then((data) => {
      this.navCtrl.pop();
      firebase.firestore().disableNetwork();
    })
  }

  checkImg(url) {
    firebase.auth().currentUser.updateProfile({
        photoURL: url,
        displayName: null
    }).then(() => {
      this.fireinfo.doc(firebase.auth().currentUser.uid).update({
        photoURL: url
      }).then(() => {
        this.toastCtrl.create({
          message: "บันทึกรูปภาพสำเร็จ",
          duration: 3000,
          position: 'top'
        }).present();
        this.navCtrl.push(RegisterNamePage);
      })
      .catch((err) => {
        console.log(err);
        this.toastCtrl.create({
          message: "บันทึกข้อมูลไม่สำเร็จ",
          duration: 3000,
          position: 'top'
        }).present();
      })
    })

  }

  next(){
    if(this.image === "assets/imgs/user.png") {
      this.checkImg(this.image);
    }else {      
      this.userservice.uploadImgUser(this.uid, this.image).then((url) => {
        console.log(url);
        this.checkImg(url);
      }).catch((err) => {
        console.log(err);
        this.toastCtrl.create({
          message: "บันทึกรูปภาพไม่สำเร็จ",
          duration: 3000,
          position: 'top'
         }).present();
      })
    }
  }


}
