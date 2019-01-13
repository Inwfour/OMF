import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { User } from '../../models/user';
import { ChatbotPage } from '../chatbot/chatbot';
import { FeedPage } from '../feed/feed';
import firebase from 'firebase';


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  user :User = new User;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events
    ) {
  }

  feed(){
    this.navCtrl.push(FeedPage);
  }

  chatbot(){
    this.navCtrl.push(ChatbotPage);
  }

  logout(){
    firebase.auth().signOut().then((data) => {
      console.log(data);
      this.events.publish('user:logout');
      firebase.firestore().disableNetwork();
    })

  }

}
