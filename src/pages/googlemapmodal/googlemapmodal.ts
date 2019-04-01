import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { FamilyProvider } from '../../providers/family/family';

/**
 * Generated class for the GooglemapmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-googlemapmodal',
  templateUrl: 'googlemapmodal.html',
})
export class GooglemapmodalPage {
  myfamilys: any = [];
  infofamily: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public familyservice: FamilyProvider,
    public viewCtrl: ViewController,
    public events: Events
    ) {
  }

  ionViewWillEnter() {
    console.log("success");
    this.getfamilys();
  }

  ionViewWillLeave() {
    this.events.unsubscribe('infofamilys');
  }

  getfamilys() {
    this.familyservice.getmyfamilys().then((data) => {
      this.myfamilys = data;
    })
  }

  searchlocation(item) {
    console.log(item.id);
    // this.familyservice.checkInfoGetMyFamilys(item);
    this.events.subscribe('infofamilys', async() => {
      this.infofamily = [];
      this.infofamily = this.familyservice.infofamilys;
      if(this.infofamily.data().location){
      await this.viewCtrl.dismiss({
        user: this.infofamily.data(),
        lat : this.infofamily.data().location.latitude,
        lng : this.infofamily.data().location.longitude
      })
    }else {
      alert("ไม่มีตำแหน่งปัจจุบัน");
    }
    })
  }
  
  close() {
    this.viewCtrl.dismiss().then(() => {
    }) ;
  }
}
