import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-edituser',
  templateUrl: 'edituser.html',
})
export class EdituserPage {
  user:any = [];
  _uid:any;
  dis:any = [];
  fireinfo = firebase.firestore().collection("informationUser");
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _USER: UserProvider,
    private alertCtrl:AlertController
    ) {
      this._uid = firebase.auth().currentUser.uid;
      this._USER.getInformationUser(this._uid).then(data => {
        this.user = data;
        console.log(this.user);
      })
  }

  edituser(){
    this._USER.editUser(this.user).then(() => {
      this.alertCtrl.create({
        title: 'บันทึกสำเร็จแล้ว',
        buttons:['ตกลง']
      }).present();
    })
  }

  editdisease() {
    let alert = this.alertCtrl.create({
      title: 'ตำแหน่งของสมาชิกในครอบครัว ?',
      inputs: [
        {
          name: 'โรคความดันโลหิตสูง',
          type: 'checkbox',
          label: 'โรคความดันโลหิตสูง',
          value: 'โรคความดันโลหิตสูง'
        },
        {
          name: 'โรคเบาหวาน',
          type: 'checkbox',
          label: 'โรคเบาหวาน',
          value: 'โรคเบาหวาน'
        },
        {
          name: 'โรคอัลไซเมอร์',
          type: 'checkbox',
          label: 'โรคอัลไซเมอร์',
          value: 'โรคอัลไซเมอร์'
        },
        {
          name: 'โรคข้อเสื่อม',
          type: 'checkbox',
          label: 'โรคข้อเสื่อม',
          value: 'โรคข้อเสื่อม'
        },
        {
          name: 'โรคซึมเศร้า',
          type: 'checkbox',
          label: 'โรคซึมเศร้า',
          value: 'โรคซึมเศร้า'
        },
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'ยืนยันการแก้ไข',
          handler: (data) => {  
            this.user.disease = data;
          }
        }
      ]
    })
    alert.present();
  }

}
