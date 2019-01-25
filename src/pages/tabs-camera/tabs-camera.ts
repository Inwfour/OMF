import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera,CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the TabsCameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs-camera',
  templateUrl: 'tabs-camera.html',
})
export class TabsCameraPage {
  image:any = "";
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public camera:Camera,
    public viewCtrl:ViewController
    ) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  addPhoto(){
    this.lunchCamera();
  }

  lunchCamera(){
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      targetHeight:512,
      targetWidth:512,
    }

    this.camera.getPicture(options).then((base64Image) => {
      this.image = 'data:image/png;base64,' + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }

}
