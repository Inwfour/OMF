import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular'
import { UserProvider } from '../user/user';
@Injectable()
export class ChatProvider {
  firebuddychats = firebase.firestore().collection('buddychats');
  buddy: any;
  buddymessages = [];
  url: string = "";
  constructor(public events: Events,
    public _USER: UserProvider
  ) {
  }

  initializebuddy(buddy) {
    this.buddy = buddy;
  }

  addnewmessage(msg, img) {
    if (this.buddy) {
      var promise = new Promise((resolve, reject) => {
        //add message me
        this.firebuddychats.doc(firebase.auth().currentUser.uid).collection("buddys").doc(this.buddy.id).collection('buddy')
          .add({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }).then((data) => {
            //check add img me
            if (img != null && img != "") {
              this._USER.uploadImgChat(firebase.auth().currentUser.uid,this.buddy.id, img, data.id).then((url) => {
                this.firebuddychats.doc(firebase.auth().currentUser.uid).collection("buddys").doc(this.buddy.id)
                  .collection('buddy').doc(data.id).set({
                    sentby: firebase.auth().currentUser.uid,
                    message: msg,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    img: url
                  }).then(() => {
                    resolve(true);
                  })
              })
            }
            //add message buddy
            this.firebuddychats.doc(this.buddy.id).collection("buddys").doc(firebase.auth().currentUser.uid).collection('buddy')
              .add({
                sentby: firebase.auth().currentUser.uid,
                message: msg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              }).then((data2) => {
                //check add img you
                if (img != null && img != "") {
                  this._USER.uploadImgChat(this.buddy.id,firebase.auth().currentUser.uid, img, data2.id).then((url1) => {
                    this.firebuddychats.doc(this.buddy.id).collection("buddys").doc(firebase.auth().currentUser.uid)
                      .collection('buddy').doc(data2.id).set({
                        sentby: firebase.auth().currentUser.uid,
                        message: msg,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        img: url1
                      }).then(() => {
                        resolve(true);
                      })
                  })
                }
                resolve(true);
              }).catch((err) => {
                reject(err);
              })
          })
      })
      return promise;
    }
  }

  getbuddymessages() {
    let temp;
    this.firebuddychats.doc(firebase.auth().currentUser.uid).collection("buddys").doc(this.buddy.id).collection('buddy')
      .orderBy("timestamp")
      .get()
      .then((snapshot) => {
        this.buddymessages = [];
        this.buddymessages = snapshot.docs;
        console.log(this.buddymessages);
        // for (var tempkey in temp) {
        //   this.buddymessages.push(temp[tempkey]);
        //   console.log(this.buddymessages);
        // }
        this.events.publish('newmessage')
      })
  }
  

  remove(msg) {
    return new Promise((resolve, reject) => {
      // console.log(firebase.auth().currentUser.uid);
      // console.log(this.buddy.id);
      // console.log(msg.id);
      this.firebuddychats.doc(firebase.auth().currentUser.uid)
        .collection("buddys").doc(this.buddy.id)
        .collection("buddy").doc(msg.id)
        .delete()
        .then(() => {
          if(msg.data().img) {
          firebase.storage().ref().child("chatImages/" + firebase.auth().currentUser.uid + "/" + this.buddy.id + "/" + msg.id)
          .delete().then(() => {
            resolve(true);
          })
        }else {
          resolve(true);
        }
        }).catch(err => {
          reject(err);
        })
    })
  }

  removeall() {
    return new Promise((resolve, reject) => {
      this.firebuddychats.doc(firebase.auth().currentUser.uid)
        .collection("buddys").doc(this.buddy.id)
        .collection("buddy")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.firebuddychats.doc(firebase.auth().currentUser.uid)
              .collection("buddys").doc(this.buddy.id)
              .collection("buddy").doc(doc.id)
              .delete()
              .then(() => {
                  firebase.storage().ref().child("chatImages/" + firebase.auth().currentUser.uid + "/" + this.buddy.id + "/" + doc.id)
                  .delete().then(() => {
                    resolve(true);
                  })
                  resolve(true);
              }).catch(err => {
                reject(err);
              })
          })
          resolve(true);
        }).catch(err => {
          reject(err);
        })
    })
  }

}
