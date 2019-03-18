import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-edituser',
  templateUrl: 'edituser.html',
})
export class EdituserPage {
  user:any = {};
  _uid:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _USER: UserProvider
    ) {
      this._uid = firebase.auth().currentUser.uid;
      this._USER.getInformationUser(this._uid).then(data => {
        this.user = data;
        console.log(this.user);
      })
  }

  edituser(){
    alert("แก้ไขข้อมูลสำเร็จแล้ว");
  }

}
