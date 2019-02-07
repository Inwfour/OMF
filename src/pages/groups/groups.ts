import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { NewgroupPage } from '../newgroup/newgroup';
import { GroupsProvider } from '../../providers/groups/groups';
import { GroupchatPage } from '../groupchat/groupchat';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  allmygroups;
  groupowner;
  groupfriend;
  firegroup = firebase.firestore().collection("groups");
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl : LoadingController,
    public groupservice : GroupsProvider,
    public events : Events
    ) {
      this.getRealtimeGroups();
  }

  ionViewDidEnter(){
    this.groupservice.getmygroups();
  }

  getRealtimeGroups() {
    this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups")
    .onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
          console.log("add");
         this.ionViewDidEnter();
        }
        if (change.type == "removed") {
          // TODO
          console.log("remove");
          this.ionViewDidEnter();
        }
      })
      })
  }

  ngOnInit(){
    this.groupservice.getmygroups();
    this.events.subscribe('newgroup', () => {
      // this.allmygroups = this.groupservice.mygroups;
      this.groupowner = this.groupservice.mygroupsowner;
      this.groupfriend = this.groupservice.mygroupsfriend;
    })
  }
  ngOnDestroy() {
    this.events.unsubscribe('newgroup');
  }

  addgroup() {
    this.navCtrl.push(NewgroupPage);
  }

  openchat(group) {
    this.groupservice.getintogroup(group.groupName);
    this.navCtrl.push(GroupchatPage, { groupName : group.groupName });
  }

}
