import { Component ,NgZone,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams , Events, Content , AlertController} from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  buddy:any;
  newmessage:any;
  allmessages = [];
  photoURL:any;
  firebuddychats = firebase.firestore().collection('buddychats');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public chatservice:ChatProvider,
    public events:Events,
    public zone:NgZone,
    public alertCtrl:AlertController
    ) {
    
      this.photoURL = firebase.auth().currentUser.photoURL;
      this.buddy = this.chatservice.buddy;
      this.scrollto();
      this.events.subscribe('newmessage', () => {
        this.allmessages = [];
        this.zone.run(() => {
          this.allmessages = this.chatservice.buddymessages;
        })
      })
      this.getmessage();
  }

  addmessage() {
    this.chatservice.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
      this.ionViewDidEnter()
    })
  }

  ionViewDidEnter() {
    this.chatservice.getbuddymessages()

  }

  getmessage() {
    this.firebuddychats.doc(firebase.auth().currentUser.uid).collection("buddys").doc(this.buddy.id).collection('buddy')
    .orderBy("timestamp")
    .onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
          this.ionViewDidEnter();
        }
        if (change.type == "modified") {
          // TODO
          
        }
        if (change.type == "removed") {
          // TODO
          // this.ionViewDidEnter();
          console.log("delete");
        }
      });
    })
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  remove(msg) {
    this.alertCtrl.create({
      title: "คุณต้องการลบข้อความนี้หรือไม่ ?",
      buttons: [
        {
          text: "ไม่ตกลง"
        },
        {
          text: "ตกลง",
          handler: () => {
            this.chatservice.remove(msg).then(() => {
              this.ionViewDidEnter();
            })
          }
        }
      ]
    }).present();
  }

  removeall() {
    this.alertCtrl.create({
      title: "คุณต้องการลบข้อความทั้งหมดหรือไม่ ?",
      buttons: [
        {
          text: "ไม่ตกลง"
        },
        {
          text: "ตกลง",
          handler: () => {
            this.chatservice.removeall().then(() => {
              this.ionViewDidEnter();
            })
          }
        }
      ]
    }).present();
  }
}
