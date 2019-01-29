import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

@Injectable()
export class PostProvider {
  _postRef = firebase.firestore().collection("posts");
  constructor(public http: HttpClient) {
    
  }

  // เพิ่มรูปภาพใน Cloud Storage postImages
  uploadImgPost(_POSTID:any,img:any) {
    return new Promise((resolve, reject) => {

      let ref = firebase.storage().ref("postImages/" + _POSTID);
      let uploadTask = ref.putString(img.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        // this._LOADER.setcontentPreloader("Uploaded " + percentage + "% ...");

      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!!!");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          this._postRef.doc(_POSTID).update ({
            image: url
          }).then(() => {
            resolve(true)
          }).catch((err) => {
            reject(err)
          })
          resolve(url);
        }).catch((err) => {
          reject(err);
        })
      })
    })

  }

  uploadPost() {

  }

}
