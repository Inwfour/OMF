import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { GroupsProvider } from '../../providers/groups/groups';


@IonicPage()
@Component({
  selector: 'page-groupbuddies',
  templateUrl: 'groupbuddies.html',
})
export class GroupbuddiesPage {
  myfriends = [];
  groupmembers = [];
  searchstring;
  tempmyfriends = [];
  newbuddy;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestservice:RequestsProvider,
    public groupservice: GroupsProvider,
    public events : Events
    ) {
  }
  
  ionViewWillEnter() {
    this.requestservice.getmyfriends();
    this.events.subscribe('gotintogroup', () => {
      this.myfriends.splice(this.myfriends.indexOf(this.newbuddy.id), 1);
      this.tempmyfriends = this.myfriends;
    })
    this.events.subscribe('friends', () => {
      this.groupservice
      this.myfriends = [];
      this.myfriends = this.requestservice.myfriends;
      console.log(this.myfriends);
      this.groupmembers = this.groupservice.currentgroup;
      // console.log(this.groupmembers);
      for(var key in this.groupmembers){
        for (var friend in this.myfriends) {
          if (this.groupmembers[key].data().uid === this.myfriends[friend].id){
            this.myfriends.splice(this.myfriends.indexOf(this.myfriends[friend]), 1);
          }
        }
      }
      this.tempmyfriends = this.myfriends;
      console.log(this.tempmyfriends);
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('friends');
  }

  searchuser(searchbar) {
    let tempfriends = this.tempmyfriends;
    var q = searchbar.target.value;

    if(q.trim() == ""){
      this.myfriends = this.tempmyfriends;
      return;
    }

    tempfriends = tempfriends.filter((v) => {
      if(v.data().owner_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
    console.log(q , this.myfriends.length);
    this.myfriends = tempfriends;
  }

  addbuddy(buddy) {
    this.newbuddy = buddy;
    this.groupservice.addmember(buddy);
  }
}
