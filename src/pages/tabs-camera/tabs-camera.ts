import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
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
    public _POST : PostProvider
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
    const alert = this.alertCtrl.create({
      title: 'ประเภทโพสท์',
      inputs: [
        {
          name: 'กีฬา',
          type: 'checkbox',
          label: 'กีฬา',
          value: 'กีฬา',
          // checked: true
        },

        {
          name: 'ดนตรี',
          type: 'checkbox',
          label: 'ดนตรี',
          value: 'ดนตรี'
        },

        {
          name: 'ศาสนา',
          type: 'checkbox',
          label: 'ศาสนา',
          value: 'ศาสนา'
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
          }
        }
      ]
    });
 alert.present();

}

}
