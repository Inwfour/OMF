import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BuddiesPage } from '../buddies/buddies';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the TabsfriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabsfriends',
  templateUrl: 'tabsfriends.html',
})
export class TabsfriendsPage {
  friends:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public _USER : UserProvider
    ) {
  }

  ngOnInit(){
    this.friends = "Friend";
  }

  addbuddy() {
    this._USER.getalluserevents();
    this.navCtrl.push(BuddiesPage);
  }

}
