import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BuddiesPage } from '../buddies/buddies';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  addbuddy() {
    this.navCtrl.push(BuddiesPage);
  }

}
