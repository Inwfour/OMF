import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';

/**
 * Generated class for the GroupinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupinfo',
  templateUrl: 'groupinfo.html',
})
export class GroupinfoPage {
  groupmembers;
  groupinfoowner = [];
  groupinfofriend = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public groupservice : GroupsProvider,
    public events : Events
    ) {
  }

  ionViewWillEnter() {
    this.groupservice.getinfogroup();
    this.groupservice.getinfogroupfriend();
    this.events.subscribe('getinfogroup', () => {
      this.groupinfoowner = this.groupservice.groupinfoowner;
      console.log("owner  ", this.groupinfoowner);
    })
    this.events.subscribe('getinfogroupfriend', ()  => {
      this.groupinfofriend = this.groupservice.groupinfofriend;
      console.log("frined  ", this.groupinfofriend);
    })
  }
 
  ionViewWillLeave() {
    this.events.unsubscribe('getinfogroup');
    this.events.unsubscribe('getinfogroupfriend');
  }

}
