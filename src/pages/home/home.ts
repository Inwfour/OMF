import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,AlertController, Alert } from 'ionic-angular';
import { User } from '../../models/user';
import { ChatbotPage } from '../chatbot/chatbot';
import { FeedPage } from '../feed/feed';
import firebase from 'firebase';
import { GooglemapPage } from '../googlemap/googlemap';


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
  photoURL:any;
  displayName:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private alertCtrl:AlertController
    ) {
      this.get();
      this.getimg();
  }

  get() {
    let fireuser = firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid);
    fireuser.get().then((data) => {
      this.photoURL = data.data().photoURL;
      this.displayName = data.data().owner_name;
    })
  }

  getimg() {
    
    let firereal = firebase.firestore().collection("informationUser");

    firereal.onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type == "modified") {
          // TODO
          this.get();
          }
    });
  });

  }

  feed(){
    this.navCtrl.push(FeedPage);
  }

  chatbot(){
    this.navCtrl.push(ChatbotPage);
  }

  googleMap(){
    this.navCtrl.push(GooglemapPage);
  }

  logout(){
    let alert = this.alertCtrl.create({
      title: "ออกจากระบบ",
      message: "คุณต้องการออกจากระบบชื่อ : " + firebase.auth().currentUser.displayName + "???",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log('Cancel clicked');
          } 
        },
        {
          text: "Logout",
          handler: () => {
            firebase.auth().signOut().then((data) => {
              console.log(data);
              this.events.publish('user:logout');
              firebase.firestore().disableNetwork();
            })
          }
        }
      ]
      
    });
    alert.present();
  

  }

}
