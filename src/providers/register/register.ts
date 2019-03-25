import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class RegisterProvider {
  fireinfo = firebase.firestore().collection('informationUser');
  constructor() {

  }

  SaveUser(user) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(user.email + "@omf.com", user.password).then(() => {
        resolve(true);
      }).catch(err => {
        reject(false);
      });
    })
  }

}
