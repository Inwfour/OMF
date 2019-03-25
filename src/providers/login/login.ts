import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class LoginProvider {
  constructor() {
    
  }

  loginUser(user) {
    return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(user.email + "@omf.com",user.password).then((data) => {
      // firebase.firestore().enableNetwork();
      resolve(data);
    }).catch(err => {
      reject(err);
    })
    })

  }

}
