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

  constructor(public userservice: UserProvider,
    public events: Events,
  ) {
  }

  // getfamilysID() {
  //   return new Promise((resolve,reject) => {
  //     this.firefamilys.doc(firebase.auth().currentUser.uid).collection('family').get().then((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         resolve(doc.id);
  //       })
  //     }).catch(err => {
  //       reject(err);
  //     })
  //   })
  // }

  addfamilys(buddy, type) {
    return new Promise((resolve, reject) => {
      this.firefamilys.doc(firebase.auth().currentUser.uid).collection('family').add({
        uid: buddy.id,
        type: type
      }).then(() => {

        let updateFamily = {};
        updateFamily[`familys.${buddy.id}`] = type;
        this.fireuser.doc(firebase.auth().currentUser.uid).update(updateFamily).then(() => {
          this.firefamilys.doc(buddy.id).collection('family').add({
            uid: firebase.auth().currentUser.uid,
            type: type
          }).then(() => {
            let updateBuddy = {};
            updateBuddy[`familys.${firebase.auth().currentUser.uid}`] = type;
            this.fireuser.doc(buddy.id).update(updateBuddy).then(() => {
              resolve(true);
            })
          }).catch(err => {
            reject(err);
          })
        })

      }).catch(err => {
        reject(err);
      })
    })
  }

  getmyfamilys() {
    let allfamilys;
    var familysuid = [];
    this.typefamilys = [];
    this.firefamilys.doc(firebase.auth().currentUser.uid).collection('family')
      .get().then((snapshot) => {
        allfamilys = snapshot.docs;
        familysuid = [];
        for (var i in allfamilys) {
          familysuid.push(allfamilys[i].data().uid);
        }

      }).then(() => {
        this.userservice.getalluser().then((res: any) => {
          var allusers = [];
          allusers = res;

          this.myfamilys = [];
          for (var j in familysuid) {

            for (var key in allusers) {
              if (familysuid[j] === allusers[key].id) {
                this.myfamilys.push(allusers[key]);

              }
            }
            // console.log(this.myfamilys);
          }
          this.events.publish('familys')
        })
      })
  }

}
