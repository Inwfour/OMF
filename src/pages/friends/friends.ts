import { Component, SimpleChange, OnChanges, Input } from '@angular/core';
import { IonicPage, NavController, NavParams , Events, AlertController, Alert} from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage{
 myrequest:any = [];
 myfriends:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestservice:RequestsProvider,
    public events:Events ,
    public alertCtrl: AlertController
    ) {
  }

  getfriends(){
    this.requestservice.getmyrequests();
    this.requestservice.getmyfriends();
    this.events.subscribe('gotrequests', () => {
      this.myrequest = this.requestservice.userdetails;
    })
    this.events.subscribe('friends', () => {
      this.myfriends = this.requestservice.myfriends;
    })
  }

  ngOnInit() {
    console.log("start");
    this.getfriends();
  }

  ngOnChanges(change:SimpleChange) {
    console.log(change);
  }


  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }

  accept(item) {
    this.requestservice.acceptrequest(item).then(() => {
      this.getfriends();
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
        this.getfriends();
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
        this.getfriends();
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
}
