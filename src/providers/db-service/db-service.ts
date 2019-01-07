
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import 'rxjs/add/operator/toPromise';
import { AngularFireDatabase } from 'angularfire2/database';
/*
  Generated class for the DbServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbServiceProvider {
  user: User = new User;

  constructor(public db: AngularFireDatabase,) {
  }
  getListUser(){
    return this.db.object<User>('users/');
  }

  dbUser(user:User){
    return this.db.object<User>('users/')
  }

}
