import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { UserPage } from '../user/user';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  homePage = HomePage;
  userPage = UserPage;
  image:string = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public events:Events,
    private camera: Camera
    ) {
        events.subscribe('user:logout', () => {
          this.navCtrl.setRoot(LoginPage);
        })
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
