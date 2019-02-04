import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular'
@Injectable()
export class ChatProvider {
  firebuddychats = firebase.firestore().collection('buddychats');
  buddy:any;
  buddymessages = [];
  constructor(public events:Events,
    ) {
  }

  initializebuddy(buddy){
    this.buddy = buddy;
  }

  addnewmessage(msg) {
    if(this.buddy) {
      var promise = new Promise((resolve,reject) => {
        this.firebuddychats.doc(firebase.auth().currentUser.uid).collection("buddys").doc(this.buddy.id).collection('buddy')
        .add({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
          this.firebuddychats.doc(this.buddy.id).collection("buddys").doc(firebase.auth().currentUser.uid).collection('buddy')
          .add({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
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
      temp = snapshot.docs;
      for(var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
        console.log(this.buddymessages);
      }
      this.events.publish('newmessage')
    })
  }
}
