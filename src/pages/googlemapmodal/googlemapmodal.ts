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

  getfamilys() {
    this.familyservice.getmyfamilys().then((data) => {
      this.myfamilys = data;
    })
  }

  searchlocation(item) {
    this.familyservice.checkInfoGetMyFamilys(item);
    this.events.subscribe('infofamilys', () => {
      this.infofamily = this.familyservice.infofamilys;
      console.log(this.infofamily);
    })
  }
  
  close() {
    this.viewCtrl.dismiss().then(() => {
      this.events.unsubscribe('infofamilys');
    }) ;
  }
}
