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
  firereq = firebase.firestore().collection('requests')
  userdetails:any;
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

  getmyrequests() {
    let allmyrequests;
    var myrequests = [];
    this.firereq.doc(firebase.auth().currentUser.uid).collection('request')
    .get().then((snapshot) => {
      allmyrequests = snapshot.docs;
      myrequests = [];
        for(var i in allmyrequests){
          myrequests.push(allmyrequests[i].data().sender);
          // console.log(myrequests);
        }
      })

      this.userservice.getalluser().then((res:any) => {
        var allusers = [];
        allusers = res;
        // console.log(allusers);
        this.userdetails = [];
        for(var j in myrequests){
        for(var key in allusers) {
          if(myrequests[j] === allusers[key].id) {
            this.userdetails.push(allusers[key]);
            console.log("a ",this.userdetails.docs);
          }
        }
      }
        this.events.publish('gotrequests')
      })
  }

}
