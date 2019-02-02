import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert } from 'ionic-angular';
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
  _uid:any;
  newrequest =  {} as connreq;
  filteruser:any = [];
  temprr = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userservice : UserProvider,
    public alertCtrl: AlertController,
    public requestservice: RequestsProvider
    ) {
      this._uid = firebase.auth().currentUser.uid;
      this.userservice.getalluser().then((res:any) => {
        this.filteruser = res;
        this.temprr = res;
      })
      // firebase.firestore().collection("informationUser").get().then((query) => {
      //   query.forEach(docs => {
      //     this.filteruser.push(docs);
      //     console.log(this.filteruser);
      //     this.temprr.push(docs);
      //   }) 
      // })
  }

  test(user){
    console.log(user);
  }

  searchuser(searchbar) {
    this.filteruser = this.temprr;
    var q = searchbar.target.value;
    if(q.trim() == ''){
      return;
    }
    this.filteruser = this.filteruser.filter((v) => {
      if(v.data().owner_name && q) {
        if(v.data().owner_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(q, this.filteruser.length);
  }

  sendreq(recipient) {
    this.newrequest.sender = firebase.auth().currentUser.uid;
    this.newrequest.recipient = recipient.id;
    console.log(this.newrequest.sender);
    console.log(this.newrequest.recipient);
    if(this.newrequest.sender == this.newrequest.recipient){
      alert('You are your friend always');
    }else {
        let successalert = this.alertCtrl.create({
            title: 'ส่งคำร้องขอ',
            subTitle: 'คุณได้ส่งคำร้องขำไปที่ ' + recipient.data().owner_name,
            buttons: [
              {
                text:"Cancel"
              }
            ]
        });
        this.requestservice.sendrequest(this.newrequest).then((res:any) => {
          if (res.success){
          successalert.present();
          let sentuser = this.filteruser.indexOf(recipient);
          this.filteruser.splice(sentuser, 1);
        }
        }).catch((err) => {
          alert(err);
        })
    }
  }




}
