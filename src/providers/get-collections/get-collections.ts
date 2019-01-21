import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the CollectionServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CollectionServicesProvider {

  constructor(public http: HttpClient) {
    
  }

  CommentsCollection(){
    return firebase.firestore().collection("comments");
  }

  PostsCollection(){
    return firebase.firestore().collection("posts");
  }

  UsersCollection(){
    return firebase.firestore().collection("users");
  }

}
