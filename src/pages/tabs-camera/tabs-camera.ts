import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { PostProvider } from '../../providers/post/post';
import { ImageProvider } from '../../providers/image/image';
import { CollectionServicesProvider } from '../../providers/get-collections/get-collections';
import firebase from 'firebase';
import { FeedPage } from '../feed/feed';

@IonicPage()
@Component({
  selector: 'page-tabs-camera',
  templateUrl: 'tabs-camera.html',
})
export class TabsCameraPage {
  image:any = "";
  text:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public camera:Camera,
    public viewCtrl:ViewController,
    public actionSheetCtrl: ActionSheetController,
    public _IMG : ImageProvider,
    public alertCtrl: AlertController,
    public loadingCtrl : LoadingController,
    public CollectionService : CollectionServicesProvider,
    public _POST : PostProvider,
    public toastCtrl : ToastController,
    ) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  changePostPicture() {
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

  post() {
    if (typeof (this.text) == "string" && this.text.length > 0) { 
      const alert = this.alertCtrl.create({
        title: 'ประเภทโพสท์',
        inputs: [
          {
            name: 'ทั่วไป',
            type: 'radio',
            label: 'ทั่วไป',
            value: 'other',
          },
          {
            name: 'กีฬา',
            type: 'radio',
            label: 'กีฬา',
            value: 'sport',
          },
          {
            name: 'ดนตรี',
            type: 'radio',
            label: 'ดนตรี',
            value: 'music'
          },
          {
            name: 'ศาสนา',
            type: 'radio',
            label: 'ศาสนา',
            value: 'regilion'
          },
        ],
        buttons: [
          {
            text: 'ยกเลิก',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (data) => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'โพสท์',
            handler: (data) => {
              if(data != null || data != undefined){
              let loader = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="assets/imgs/loading.svg">`
              });
              loader.present();
              this.CollectionService.PostsCollection().add({
                text: this.text,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                owner: firebase.auth().currentUser.uid,
                owner_name: firebase.auth().currentUser.displayName,
                likes: {
                  [`${firebase.auth().currentUser.uid}`]: false
                },
                likesCount: 0,
                photoUser: firebase.auth().currentUser.photoURL,
                type: data
          
              }).then(async (doc) => {
          
                console.log(doc);
          
                if (this.image) {
                  await this._POST.uploadImgPost(doc.id, this.image);
                }
          
                this.text = "";
                this.image = undefined;
                loader.dismiss();
                this.navCtrl.push(FeedPage);
              }).catch((err) => {
                loader.dismiss();
                console.log(err);
              })
            } else {
              this.toastCtrl.create({
                message: "กรุณาเลือกประเภท",
                duration: 2000
              }).present();
            }
            }
          }
        ]
      });
   alert.present();
  } else {
    this.toastCtrl.create({
      message: "กรุณาระบุข้อความให้ถูกต้อง",
      duration: 2000
    }).present();
  }
  }

}
