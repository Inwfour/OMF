import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { DbServiceProvider } from '../../providers/db-service/db-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { User } from '../../models/user';
import { ChatbotPage } from '../chatbot/chatbot';
import { FeedPage } from '../feed/feed';
import firebase from 'firebase';
import { LoginPage } from '../login/login';

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
    public serviceData: DbServiceProvider,
    public serviceAuth: AuthServiceProvider,
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
    // firebase.auth().signOut().then(() => {
    //   let toast = this.toastCtrl.create({
    //     message: "Logout Success !!!",
    //     duration: 3000
    //   }).present();
    //   this.navCtrl.setRoot(LoginPage);
    // })
    this.serviceAuth.doLogout()
    this.events.publish('user:logout');

  }

}
