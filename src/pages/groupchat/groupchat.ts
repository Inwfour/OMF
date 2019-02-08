import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Events, Content } from 'ionic-angular';
import { GroupsProvider } from '../../providers/groups/groups';
import { GroupbuddiesPage } from '../groupbuddies/groupbuddies';
import { GroupmembersPage } from '../groupmembers/groupmembers';
import { GroupinfoPage } from '../groupinfo/groupinfo';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {
  @ViewChild('content') content : Content;
  owner: boolean = false;
  groupName;
  newmessage;
  allgroupmsgs;
  alignuid;
  photoURL;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public groupservice:GroupsProvider,
    public actionSheetCtrl:ActionSheetController,
    public events : Events
    ) {
      this.alignuid = firebase.auth().currentUser.uid;
      this.photoURL = firebase.auth().currentUser.photoURL;
      this.groupName = this.navParams.get('groupName');
      this.groupservice.getownership(this.groupName).then((res) => {
          if(res){
            this.owner = true;
          }
      }).catch(err => {
        alert(err);
      })
      this.groupservice.getgroupmsgs(this.groupName);
      this.events.subscribe('newgroupmsg', () => {
        this.allgroupmsgs = [];
        this.allgroupmsgs = this.groupservice.groupmsgs;
        this.scrollto();
      })
  }

  presentOwnerSheet() {
    let sheet = this.actionSheetCtrl.create({
      title: 'ตัวเลือกสำหรับกลุ่ม',
      buttons: [
        {
          text: 'เพิ่มเพื่อนเข้ากลุ่ม',
          icon: 'person-add',
          handler: () => {
            this.navCtrl.push(GroupbuddiesPage);
          }
        },
        {
          text: 'ลบเพื่อนออกจากลุ่ม',
          icon: 'remove-circle',
          handler: () => {
            this.navCtrl.push(GroupmembersPage);
          }
        },
        {
          text: 'ข้อมูลกลุ่ม',
          icon: 'person',
          handler: () => {
            this.navCtrl.push(GroupinfoPage, {groupName: this.groupName});
          }
        },
        {
          text: 'ลบกลุ่ม',
          icon: 'trash',
          handler: () => {
            this.groupservice.deletegroup().then(() => {
              this.navCtrl.pop();
            }).catch((err) => {
              console.log(err);
            })
          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    })
    sheet.present();
  }

  presentMemberSheet() {
    let sheet = this.actionSheetCtrl.create({
      title: 'ตัวเลือกสำหรับกลุ่ม',
      buttons: [
        {
          text: 'ออกจากกลุ่ม',
          icon: 'log-out',
          handler: () => {
            this.groupservice.leavegroup().then(() => {
              this.navCtrl.pop();
            }).catch((err) => {
              console.log(err);
            })
          }
        },
        {
          text: 'ข้อมูลกลุ่ม',
          icon: 'person',
          handler: () => {
            this.navCtrl.push(GroupinfoPage, {groupName: this.groupName});
          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        }
      ]
    })
    sheet.present();
  }

  addgroupmsg() {
    this.groupservice.addgroupmsg(this.newmessage).then(() => {
      this.scrollto();
      this.newmessage = '';
    })
  }


  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

}
