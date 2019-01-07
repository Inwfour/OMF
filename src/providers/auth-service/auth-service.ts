import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/toPromise';
import { DbServiceProvider } from '../db-service/db-service';


@Injectable()
export class AuthServiceProvider {



  constructor( public loadingCtrl: LoadingController,
    public afAuth: AngularFireAuth, 
    public serviceData: DbServiceProvider
    ) {

  }

  getAuthState(){
    return this.afAuth.auth;
}

  singinUser(user:User){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password).then(
        res => resolve(res),
        err => reject(err))
    })
  }

  signupUser(user:User){
    return new Promise<any>((resolve, reject) => {
    this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password).then(
    res => resolve(res),
    err => reject(err))
    })
  }

  doLogout(){
    this.afAuth.auth.signOut();
  }




  // addItem(user:User){
  //   this.db.object<User>('')
  // }

  

}
