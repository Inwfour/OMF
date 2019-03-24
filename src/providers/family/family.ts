import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import firebase from 'firebase';
import { UserProvider } from '../user/user';

@Injectable()
export class FamilyProvider {
  firefamilys = firebase.firestore().collection('familys');
  fireuser = firebase.firestore().collection('informationUser');
  myfamilys: any;
  typefamilys: any = [];
  familysuid:any;

  constructor(public userservice: UserProvider,
    public events: Events,
  ) {
  }

  addfamilys(buddy, type) {
    return new Promise((resolve, reject) => {

      this.firefamilys.doc(firebase.auth().currentUser.uid).collection('family').add({
        uid: buddy.id,
        phone: buddy.data().phone,
        photoURL: buddy.data().photoURL,
        owner_name: buddy.data().owner_name,
        type: type
      }).then(() => {
        this.fireuser.doc(firebase.auth().currentUser.uid).get().then((data) => {
          this.firefamilys.doc(buddy.id).collection('family').add({
            uid: data.data().owner,
            phone: data.data().phone,
            photoURL: data.data().photoURL,
            owner_name: data.data().owner_name,
            type: type
          }).then(() => {
            resolve(true);
          })
          .catch(err => {
            reject(err);
          })
        }).catch(err => {
          reject(err);
        }) 
        })
    })
  }

  getmyfamilys() {
    return new Promise((resolve, reject) => {
      this.firefamilys.doc(firebase.auth().currentUser.uid).collection('family')
      .get().then((snapshot) => {
        this.familysuid = [];
        snapshot.forEach((doc) => {
          this.familysuid.push(doc);
        })
        resolve(this.familysuid);
      }).catch(err => {
        reject(err);
      })
    })
  }

  edittype(buddy, type){
    return new Promise((resolve, reject) => {
      this.firefamilys.doc(firebase.auth().currentUser.uid).collection('family').doc(buddy.id).update({
        type: type
      }).then(() => {
        this.firefamilys.doc(buddy.data().uid).collection("family").where("uid", "==", firebase.auth().currentUser.uid).get().then((res) => {
          res.forEach((doc) => {
            this.firefamilys.doc(buddy.data().uid).collection('family').doc(doc.id).update({
              type: type
            }).then(() => {
              resolve(true);
            })
            .catch(err => {
              reject(err);
            })
          })
        }).catch(err => {
          reject(err);
        }) 
        })
    })
  }

  deletefamily(buddy) {
    return new Promise((resolve, reject) => {
       this.firefamilys.doc(firebase.auth().currentUser.uid).collection('family').doc(buddy.id).delete().then(() => {
        this.firefamilys.doc(buddy.data().uid).collection("family").where("uid", "==", firebase.auth().currentUser.uid).get().then((res) => {
          res.forEach((doc) => {
            this.firefamilys.doc(buddy.data().uid).collection('family').doc(doc.id).delete().then(() => {
              resolve(true);
            })
            .catch(err => {
              reject(err);
            })
          })
        }).catch(err => {
          reject(err);
        }) 
        })
    })
  }
}
