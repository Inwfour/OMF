import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert, Events } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import firebase from 'firebase';
import { connreq } from '../../models/request';
import { RequestsProvider } from '../../providers/requests/requests';

@IonicPage()
@Component({
  selector: 'page-buddies',
  templateUrl: 'buddies.html',
})
export class BuddiesPage {
  _uid: any;
  newrequest = {} as connreq;
  filteruser: any = [];
  temprr: any = [];
  myrequest: any = [];
  myfriends: any = [];
  nofriend: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userservice: UserProvider,
    public alertCtrl: AlertController,
    public requestservice: RequestsProvider,
    public events: Events
  ) {
    this._uid = firebase.auth().currentUser.uid;
    this.userservice.getalluser().then((res: any) => {
      this.filteruser = res;
      this.temprr = res;
    })
  }

  searchuser(searchbar) {
    this.filteruser = this.temprr;
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }
    this.filteruser = this.filteruser.filter((v) => {
      if (v.data().owner_name && q) {
        if (v.data().owner_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(q, this.filteruser.length);
  }

  sendreq(recipient) {
    let checkrequest;
    let checkconfirmrequest;
    let checkfriend;
    this.newrequest.sender = firebase.auth().currentUser.uid;
    this.newrequest.recipient = recipient.id;

    if (this.newrequest.sender == this.newrequest.recipient) {
      let alert = this.alertCtrl.create({
        title: 'คุณไม่สามารถเพิ่มตัวคุณเป็นเพื่อนได้ !!!',
        buttons: [
          {
            text: "ตกลง"
          }
        ]
      })
      alert.present();


    } else if (this.newrequest.sender != this.newrequest.recipient) {
      this.requestservice.checkrequests(this.newrequest).then((docs) => {
        checkrequest = docs;

        if (checkrequest == "") {
          this.requestservice.checkconfirmrequests(this.newrequest).then((docs) => {
            checkconfirmrequest = docs;
            if (checkconfirmrequest == "") {
              this.requestservice.checkfriend(this.newrequest).then((docs) => {
                checkfriend = docs
                if (checkfriend == "") {
                  let successalert = this.alertCtrl.create({
                    title: 'ส่งคำร้องขอ',
                    subTitle: 'คุณได้ส่งคำร้องขอไปที่ ' + recipient.data().owner_name,
                    buttons: [
                      {
                        text: "ตกลง"
                      }
                    ]
                  });
                  this.requestservice.sendrequest(this.newrequest).then((res: any) => {
                    if (res.success) {
                      successalert.present();
                      let sentuser = this.filteruser.indexOf(recipient);
                      this.filteruser.splice(sentuser, 1);
                    }
                  }).catch((err) => {
                    alert(err);
                  })
                } else {
                  this.alertCtrl.create({
                    title: 'คุณได้เป็นเพื่อนกับ ' + recipient.data().owner_name + ' แล้ว',
                    buttons: [
                      {
                        text: "ตกลง"
                      }
                    ]
                  }).present();
                }
              })
            } else {
              this.alertCtrl.create({
                title: 'ได้เพิ่มเพื่อนเพื่อรอการยืนยันแล้วจาก ' + recipient.data().owner_name,
                buttons: [
                  {
                    text: "ตกลง"
                  }
                ]
              }).present();
            }
          })

        } else {
          this.alertCtrl.create({
            title: 'คุณได้ส่งคำขอเพิ่มเพื่อนกับ ' + recipient.data().owner_name + ' แล้ว',
            buttons: [
              {
                text: "ตกลง"
              }
            ]
          }).present();
        }

      })
    }
  }
}
