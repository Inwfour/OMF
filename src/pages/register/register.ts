import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: User = new User;
  image: string = "assets/imgs/user.png";
  _uid:any;
  url:string = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private camera: Camera
  ) {
  }

  addPhoto() {
    this.lunchCamera();
  }

  lunchCamera() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 300,
      targetWidth: 300,
    }

    this.camera.getPicture(options).then((base64Image) => {
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }

  getImageLibrary() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300
    }

    this.camera.getPicture(options).then((base64Image) => {
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }


  save() {

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`

    });

    loader.present();

    firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(async (data) => {
        if (this.image != "assets/imgs/user.png") {
          await this.upload();
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
        loader.dismiss();
        this.navCtrl.setRoot(LoginPage);
      }).catch((err) => {
        loader.dismiss();
        this.toastCtrl.create({
          message: err.message,
          duration: 3000
        }).present();
      })
  }

  upload() {
    return new Promise((resolve, reject) => {

      let loader = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="assets/imgs/loading.svg">`,

      });
      loader.present();

      let ref = firebase.storage().ref("postImages/" + this.user.name);

      let uploadTask = ref.putString(this.image.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        loader.setContent("Uploaded " + percentage + "% ...")

      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!!!");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          var newPhoto = firebase.auth().currentUser;
          newPhoto.updateProfile({
            displayName: "",
            photoURL: url
          }).then(() => {
            loader.dismiss();
            this.url = firebase.auth().currentUser.photoURL;
            resolve()
          }).catch((err) => {
            loader.dismiss();
            reject()
          })
        }).catch((err) => {
          reject()
        })
      })
    })

  }


}
