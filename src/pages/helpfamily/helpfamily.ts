import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SMS } from '@ionic-native/sms';

/**
 * Generated class for the HelpfamilyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-helpfamily',
  templateUrl: 'helpfamily.html',
})
export class HelpfamilyPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private callNumber: CallNumber,
    private androidPermissions: AndroidPermissions,
    private sms: SMS,
    ) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  call(){
    this.callNumber.callNumber('0887665841', true).then(() => {
      console.log("Worked");
    }).catch((err) => {
      alert(JSON.stringify(err));
    })
  }


  sendSMS(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
  result => {
    console.log('Has permission?',result.hasPermission);

    if(result.hasPermission){
      this.sms.send("342423423","Hi")
      .then(()=>{
      console.log("The Message is sent");
      }).catch((error)=>{
      console.log("The Message is Failed",error);
      });
    }
  },
  err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
);

  }

}
