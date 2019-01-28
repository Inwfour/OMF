import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { PreloaderProvider } from '../preloader/preloader';
import { ImageProvider } from '../image/image';

@Injectable()
export class UploadImgProvider {
  url:any;
  constructor(  public http: HttpClient,
                public _LOADER: PreloaderProvider,
                public _IMG: ImageProvider
    ) {
    
  }

  uploadImgProfile(name:any,img:any) {
    return new Promise((resolve, reject) => {

    //  this._LOADER.displayPreloader();

      let ref = firebase.storage().ref("postImages/" + name);
      let uploadTask = ref.putString(img.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        this._LOADER.setcontentPreloader("Uploaded " + percentage + "% ...");

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
            // this._LOADER.hidePreloader();
            this.url = firebase.auth().currentUser.photoURL;
            resolve(this.url)
          }).catch((err) => {
            // this._LOADER.hidePreloader();
            reject(err)
          })
        }).catch((err) => {
          reject(err)
        })
      })
    })

  }

}
