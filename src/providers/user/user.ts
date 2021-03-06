import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { PreloaderProvider } from '../preloader/preloader';
import { ImageProvider } from '../image/image';
import { Events } from 'ionic-angular';

@Injectable()
export class UserProvider {
  firereq = firebase.firestore().collection('requests');
  firefriends = firebase.firestore().collection('friends');
  fireuser = firebase.firestore().collection('informationUser');
  temparr: Array<any> = [];
  constructor(public http: HttpClient,
    public _LOADER: PreloaderProvider,
    public _IMG: ImageProvider,
    public events: Events
  ) {

  }

  //reset Email
  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        console.log("success reset");
        resolve(true);
      }).catch((err) => {
        console.log("error = " + err);
        reject(err);
      })
    })
    return promise;
  }

  // get All user
  getalluser() {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection("informationUser").get().then((snapshot) => {
        let temparr = [];
        snapshot.forEach((docs) => {
          temparr.push(docs);
        })
        resolve(temparr);
      }).catch(err => {
        reject(err);
      })
    })
  }


  getalluserevents() {
    firebase.firestore().collection("informationUser").get().then((snapshot) => {
      this.temparr = [];
      snapshot.forEach((docs) => {
        this.temparr.push(docs);
      })
      this.events.publish('getuserevent');
    })
  }

  // รับค่า User
  getInformationUser(uid: any) {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection("informationUser")
        .doc(uid)
        .get()
        .then((data) => {
          resolve(data.data());
        }).catch(err => {
          reject(err);
        })
    })
  }

  // เพิ่มรูปภาพเข้า Cloud Storage profileImages
  uploadImgUser(_uid: any, img: any) {
    return new Promise((resolve, reject) => {
      let ref = firebase.storage().ref("profileImages/" + _uid);
      let uploadTask = ref.putString(img.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;

      }, (error) => {
        console.log(error)
      }, () => {
        console.log("เพิ่มรูปภาพสำเร็จ");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          resolve(url)
        }).catch((err) => {
          reject(err)
        })
      })
    })

  }

  //เพิ่มรูปภาพแชท
  uploadImgChat(_uid: any, buddyid, img: any, _chatuid: any) {
    return new Promise((resolve, reject) => {

      let ref = firebase.storage().ref("chatImages/" + _uid + "/" + buddyid + "/" + _chatuid);
      let uploadTask = ref.putString(img.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;

      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!!!");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          resolve(url)
        }).catch((err) => {
          reject(err)
        })
      })
    })

  }

  uploadImgGroup(newgroup) {
    return new Promise((resolve, reject) => {

      let ref = firebase.storage().ref("groupImages/" + newgroup.groupName + "/" + newgroup.groupPic);
      let uploadTask = ref.putString(newgroup.groupPic.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;

      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!!!");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          resolve(url)
        }).catch((err) => {
          reject(err)
        })
      })
    })
  }

  // อัพเดทรูปภาพหน้า User
  updateImgUser(name: any, url: any) {

    return new Promise((resolve, reject) => {
      var newUser = firebase.auth().currentUser;
      var newInformationUser = firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid);
      newUser.updateProfile({
        displayName: name,
        photoURL: url
      }).then(() => {
        newInformationUser.update({
          photoURL: url,
        }).then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
  }

  // ลบรูปจาก Cloud Storage
  deleteImgUser() {
    return new Promise((resolve, reject) => {
      // Create a reference to the file to delete
      var desertRef = firebase.storage().ref().child("profileImages/" + name);

      // Delete the file
      desertRef.delete().then(function () {
        // File deleted successfully
      }).catch(function (error) {
        // Uh-oh, an error occurred!
      });
    })
  }

  deleteImgGroup(groupname) {
    return new Promise((resolve, reject) => {
      firebase.storage().ref("groupImages/" + groupname).delete().then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    })
  }

  searchDisease() {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection("searchdisease").orderBy(firebase.auth().currentUser.uid, "desc").get().then((snapshot) => {
        let disease = [];
        snapshot.forEach((docs) => {
          disease.push(docs);
        })
        resolve(disease);
      }).catch(err => {
        reject(err);
      })
    })
  }

  editUser(user) {
    return new Promise((resolve, reject) => {
      this.fireuser.doc(firebase.auth().currentUser.uid).update({
        owner_name: user.owner_name,
        age: user.age,
        phone: user.phone,
        disease: user.disease
      }).then(() => {
        var newUser = firebase.auth().currentUser;
        newUser.updateProfile({
         displayName: user.owner_name,
         photoURL: user.photoURL
       }).then(() => {
        resolve(true)
       }).catch((err) => {
         reject(err);
       })
      }).catch(err => {
        reject(err);
      })
    })
  }

  editImagePostandCommentsandFamily() {
    return new Promise((resolve, reject) => {

    })
  }

  editDetailPostandCommentsandFamily() {
    return new Promise((resolve, reject) => {
      
    })
  }

}
