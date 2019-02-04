import { connreq } from '../../models/request';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
import { Events } from 'ionic-angular';
/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RequestsProvider {
  firereq = firebase.firestore().collection('requests');
  firefriends = firebase.firestore().collection('friends');
  userdetails:any;
  myfriends:any;
  constructor(public userservice:UserProvider,
    public events:Events
    ) {
    
  }

  sendrequest(req: connreq) {
    return new Promise((resolve,reject) => {
      this.firereq.doc(req.recipient).collection('request').add({
        sender: req.sender
      }).then(() => {
        resolve({success:true});
      }).catch((err) => {
        resolve(err);
      })
    })
  }

  acceptrequest(buddy) {
    return new Promise((resolve,reject) => {
      this.firefriends.doc(firebase.auth().currentUser.uid).collection('friend').add({
        uid:buddy.id
      }).then(() => {
        this.firefriends.doc(buddy.id).collection('friend').add({
          uid: firebase.auth().currentUser.uid
        }).then(() => {
          this.deleterequest(buddy).then(() => {
            resolve(true); 
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      }).catch(err => {
        reject(err);
      })
    })
   
  }

    deleterequest(buddy) {
      return new Promise((resolve, reject) => {
        let tempstore;
        this.firereq.doc(firebase.auth().currentUser.uid).collection('request').where("sender", "==", buddy.id).get().then((snapshot) => {
          tempstore = snapshot.docs;
          this.firereq.doc(firebase.auth().currentUser.uid).collection('request').doc(tempstore[0].id).delete().then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          })
        }).catch(err => {
          reject(err);
        }).catch(err => {
          reject(err);
        })
        
      })
    }

    unfriend(buddy) {
      return new Promise((resolve, reject) => {
        let myuid;
        let frienduid;
        this.firefriends.doc(firebase.auth().currentUser.uid).collection('friend').where("uid", "==", buddy.id)
        .get()
        .then((snapshot) => {
          frienduid = snapshot.docs
          this.firefriends.doc(firebase.auth().currentUser.uid).collection('friend').doc(frienduid[0].id)
          .delete()
          .then(() => {
            resolve(true);
          }).catch(err => {
            reject(err);
          })
        })
        this.firefriends.doc(buddy.id).collection('friend').where("uid", "==", firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          myuid = snapshot.docs
          this.firefriends.doc(buddy.id).collection('friend').doc(myuid[0].id)
          .delete()
          .then(() => {
            resolve(true);
          }).catch(err => {
            reject(err);
          })
        })
      })
    }

    getmyrequests() {
      let allmyrequests;
      var myrequests = [];
      this.firereq.doc(firebase.auth().currentUser.uid).collection('request')
      .get().then((snapshot) => {
        allmyrequests = snapshot.docs;
        myrequests = [];
          for(var i in allmyrequests){
            myrequests.push(allmyrequests[i].data().sender);
          }
        })
  
        this.userservice.getalluser().then((res:any) => {
          var allusers = [];
          allusers = res;
          // console.log(myrequests);
          this.userdetails = [];
          for(var j in myrequests){
          for(var key in allusers) {
            if(myrequests[j] === allusers[key].id) {
              this.userdetails.push(allusers[key]);
            }
          }
        }
          this.events.publish('gotrequests')
        })
    }

    getmyfriends() {
      let allfriends;
      var friendsuid = [];
      this.firefriends.doc(firebase.auth().currentUser.uid).collection('friend')
      .get().then((snapshot) => {
        allfriends = snapshot.docs;
        friendsuid = [];
        for(var i in allfriends){
          friendsuid.push(allfriends[i].data().uid);   
        }
        
      }).then(() => {
        this.userservice.getalluser().then((res:any) => {
        var allusers = [];
        allusers = res;
        
        this.myfriends = [];
        for(var j in friendsuid){
          
        for(var key in allusers) {
          // console.log("a ",friendsuid[j]);
          // console.log("b ",allusers[key].id);
          if(friendsuid[j] === allusers[key].id) {
            this.myfriends.push(allusers[key]);
            // console.log(this.myfriends);
          }
        }
      }
        this.events.publish('friends')
      })
    })
    }
    
    checkrequests(req: connreq) {
      return new Promise((resolve,reject) => {
        this.firereq.doc(req.recipient).collection("request").where("sender" , "==" , req.sender)
        .get().then((snapshot) => {
          resolve(snapshot.docs);
        }).catch((err) => {
          reject(err)
        })
      })
    }

    checkconfirmrequests(req: connreq) {
      return new Promise((resolve,reject) => {
        this.firereq.doc(req.sender).collection("request").where("sender" , "==" , req.recipient)
        .get().then((snapshot) => {
          resolve(snapshot.docs);
        }).catch((err) => {
          reject(err)
        })
      })
    }

    checkfriend(req: connreq) {
      return new Promise((resolve,reject) => {
        this.firefriends.doc(req.recipient).collection("friend").where("uid", "==" , req.sender)
        .get().then((snapshot) => {
          resolve(snapshot.docs);
        }).catch((err) => {
          reject(err)
        })
      })
    }

    
}
