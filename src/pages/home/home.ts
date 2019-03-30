import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,AlertController, Alert } from 'ionic-angular';
import { User } from '../../models/user';
import { ChatbotPage } from '../chatbot/chatbot';
import { FeedPage } from '../feed/feed';
import firebase from 'firebase';
import { GooglemapPage } from '../googlemap/googlemap';
import { HelpPage } from '../help/help';
import { HowtoPage } from '../howto/howto';
import { FamilyPage } from '../family/family';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { CollectionServicesProvider } from '../../providers/get-collections/get-collections';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  user :User = new User;
  photoURL:any;
  displayName:any;
  latitude:number ;
  longitude:number ;
  photoDisplay: string;
  _uid: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private alertCtrl:AlertController,
    public geolocation: Geolocation,
    private LunchNavigator: LaunchNavigator,
    private firebaseCordova: Firebase,
    private CollectionService: CollectionServicesProvider,
    ) {
      this.get();
      this.getimg();
      this._uid = firebase.auth().currentUser.uid;
      this.photoDisplay = firebase.auth().currentUser.photoURL
      this.firebaseCordova.getToken().then((token) => {
        console.log(token);
        this.updateToken(token, firebase.auth().currentUser.uid);
      }).catch((err) => {
        console.log(err);
      })
  }

  updateToken(token: string, uid: string) {

    this.CollectionService.UsersCollection().doc(uid).set({
      token: token,
      tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, {
        merge: true
      }).catch((err) => {
        console.log(err);
      })

  }

  // LocationMe() {
  //   this.geolocation.getCurrentPosition().then(position =>{
  //     this.latitude = position.coords.latitude;
  //     this.longitude = position.coords.longitude;
  // },error=>{
  //     console.log('error',error);
  // });
  // }

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
    // this.LocationMe();
    let options: LaunchNavigatorOptions = {
      start: [this.latitude,this.longitude],
      app: this.LunchNavigator.APP.GOOGLE_MAPS
    };
    
    this.LunchNavigator.navigate('London, ON', options)
      .then(() => {
        console.log("success");
      }).catch((err) => {
        console.log(err);
      })
    // this.navCtrl.push(GooglemapPage);
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
              // firebase.firestore().disableNetwork();
            })
          }
        }
      ]
      
    });
    alert.present();
  

  }

  help() {
    this.navCtrl.push(HelpPage);
  }
  
  howto() {
    this.navCtrl.push(HowtoPage);
  }

  family() {
    this.navCtrl.push(FamilyPage);
  }

}
