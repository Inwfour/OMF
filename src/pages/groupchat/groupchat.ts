import { Component, ViewChild , NgZone} from '@angular/core';
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
  firegroup = firebase.firestore().collection("groups");
  groupName:any;
  newmessage:any;
  allgroupmsgs:any;
  alignuid:any;
  photoURL:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public groupservice:GroupsProvider,
    public actionSheetCtrl:ActionSheetController,
    public events : Events,
    public ngzone : NgZone
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
      this.getrealtime();
  }

  ionViewDidEnter() {
    this.scrollto();
  this.groupservice.getgroupmsgs(this.groupName);
  this.events.subscribe('newgroupmsg', () => {
    this.allgroupmsgs = [];
    this.ngzone.run(() => {
    this.allgroupmsgs = this.groupservice.groupmsgs;
    })
  })
  }

  getrealtime() {
    console.log(this.groupName);
    this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups")
    .doc(this.groupName).collection("msgboard").onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
          console.log("addchatgroup " , change.doc.id);
          this.ionViewDidEnter()
          this.scrollto()
        }
      })
    })
  }

  ionViewWillLeave() {
    console.log("Unsub");
    this.events.unsubscribe('newgroupmsg');
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
      this.ionViewDidEnter();
      this.scrollto();
      this.newmessage = '';
    })
  }


  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom(200);
    }, 1000);
  }

}
