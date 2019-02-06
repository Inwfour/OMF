import { Component, SimpleChange, OnChanges, Input } from '@angular/core';
import { IonicPage, NavController, NavParams , Events, AlertController, Alert} from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { ChatProvider } from '../../providers/chat/chat';
import { BuddychatPage } from '../buddychat/buddychat';
import firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage{
  firereq = firebase.firestore().collection('requests');
  firefriends = firebase.firestore().collection('friends');
 myrequest:any = [];
 myfriends:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestservice:RequestsProvider,
    public events:Events ,
    public alertCtrl: AlertController,
    public chatservice: ChatProvider
    ) {
      this.getrequestschanges();
      this.getfriendschanges();
  }

  getrequests(){
    this.requestservice.getmyrequests();
    this.events.subscribe('gotrequests', () => {
      this.myrequest = this.requestservice.userdetails;
    })
  }

  getfriends(){
    this.requestservice.getmyfriends();
    this.events.subscribe('friends', () => {
      this.myfriends = this.requestservice.myfriends;
    })
  }

  ngOnInit() {
    this.getrequests();
    this.getfriends();
  }

  getrequestschanges() {
    this.firereq.doc(firebase.auth().currentUser.uid).collection('request')
    .onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
          this.getrequests();
        }
        if (change.type == "modified") {
          // TODO
          this.getrequests();
        }
        if (change.type == "removed") {
          // TODO
          this.getrequests();
        }
      });
    })
  }

  getfriendschanges() {
    this.firefriends.doc(firebase.auth().currentUser.uid).collection('friend')
    .onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
          this.getfriends();
        }
        if (change.type == "modified") {
          // TODO
          this.getfriends();
        }
        if (change.type == "removed") {
          // TODO
          this.getfriends();
        }
      });
    })
  }


  ngOnDestroy() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }

  accept(item) {
    this.requestservice.acceptrequest(item).then(() => {
      // this.getrequests();
      // this.getfriends();
      let alert = this.alertCtrl.create({
        title: 'เพิ่มเพื่อน',
        subTitle: 'คุณสามารถแชทกันได้แล้ว',
        buttons: ['ตกลง']
      });
      alert.present();
    })
  }
    ignore(item) {
      this.requestservice.deleterequest(item).then(() => {
        // this.getrequests();
        // this.getfriends();
        let alert = this.alertCtrl.create({
          title: 'ยกเลิกคำขอ',
          subTitle: 'คุณได้ยกเลิกคำขอเสร็จเรียบร้อย',
          buttons: ['ตกลง']
        });
        alert.present();
      }).catch((err) => {
        alert(err);
      })
    }

    unfriend(item) {
      this.requestservice.unfriend(item).then(() => {
        // this.getrequests();
        // this.getfriends();
        let alert = this.alertCtrl.create({
          title: 'เรียบร้อย',
          subTitle: 'ได้ลบเพื่อนเรียบร้อย',
          buttons: ['ตกลง']
        });
        alert.present();
      }).catch((err) => {
        alert(err);
      })
    }

    buddychat(buddy) {
      this.chatservice.initializebuddy(buddy);
      this.navCtrl.push(BuddychatPage)
    }
}
