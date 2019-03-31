import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, ToastController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SMS } from '@ionic-native/sms';
import { FamilyProvider } from '../../providers/family/family';
import { SocialSharing } from '@ionic-native/social-sharing';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-helpfamily',
  templateUrl: 'helpfamily.html',
})
export class HelpfamilyPage {
  myfamilys:any = [];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private callNumber: CallNumber,
    private androidPermissions: AndroidPermissions,
    private sms: SMS,
    private events: Events,
    private familyservice: FamilyProvider,
    private toast: ToastController,
    private socialSharing: SocialSharing,
    ) {
    this.getfamilys();
  }

  getfamilys(){
    this.familyservice.getmyfamilys().then((data) => {
      this.myfamilys = data;
    })
  }

  close() {
    this.viewCtrl.dismiss();
  }

  call(key){
    if(key.data().phone != undefined){
    this.callNumber.callNumber(key.data().phone, true).then(() => {
      console.log("Worked");
    }).catch((err) => {
      alert(JSON.stringify(err));
    })
  }else {
    this.toast.create({
      message: "ไม่สามารถโทรได้สมาชิกไม่ได้ระบุเบอร์ไว้",
      duration: 2000
    }).present();
  }
  }


  sendSMS(key){
    firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid).get().then((res) => {
         let message = "ช่วยด้วย !!! นี่ " + key.data().owner_name + " เอง ตอนนี้มีปัญหาช่วยติดต่อกลับมาที่ " + res.data().phone + " ด้วยนะ ด่วน ๆ"   
    this.socialSharing.shareViaSMS(message,key.data().phone).then(() => {
      console.log("SMS Success");
    }).catch((err) => {
      console.log(err);
    })
    }).catch((err) => {
      console.log(err);
    })
//     this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
//   result => {
//     console.log('Has permission?',result.hasPermission);

//     if(result.hasPermission){
//       this.sms.send("342423423","Hi")
//       .then(()=>{
//       console.log("The Message is sent");
//       }).catch((error)=>{
//       console.log("The Message is Failed",error);
//       });
//     }
//   },
//   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
// );

  }

}
