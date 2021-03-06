import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';
import { GroupsProvider } from '../../providers/groups/groups';
import { FamilyProvider } from '../../providers/family/family';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-familybuddys',
  templateUrl: 'familybuddys.html',
})
export class FamilybuddysPage {
  firefamily = firebase.firestore().collection("familys")
  myfriends = [];
  groupmembers = [];
  searchstring;
  tempmyfriends = [];
  newbuddy;
  statusme: any = "";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestservice: RequestsProvider,
    public groupservice: GroupsProvider,
    public events: Events,
    public alertCtrl: AlertController,
    public familyservice: FamilyProvider
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

      this.groupmembers = this.groupservice.currentgroup;
      for (var key in this.groupmembers) {
        for (var friend in this.myfriends) {
          if (this.groupmembers[key].data().uid === this.myfriends[friend].id) {
            this.myfriends.splice(this.myfriends.indexOf(this.myfriends[friend]), 1);
          }
        }
      }
      this.tempmyfriends = this.myfriends;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('friends');
  }

  searchuser(searchbar) {
    let tempfriends = this.tempmyfriends;
    var q = searchbar.target.value;

    if (q.trim() == "") {
      this.myfriends = this.tempmyfriends;
      return;
    }

    tempfriends = tempfriends.filter((v) => {
      if (v.data().owner_name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
    console.log(q, this.myfriends.length);
    this.myfriends = tempfriends;
  }

  addfamily(item, data, statusme) {
    this.familyservice.addfamilys(item, data, statusme).then(() => {
      let alert = this.alertCtrl.create({
        title: 'เพิ่มสมาชิกครอบครัวเรียบร้อยแล้ว',
        buttons: ['ตกลง']
      });
      alert.present();
    })
  }

  accept(item) {
    let alert = this.alertCtrl.create({
      title: 'ตำแหน่งของสมาชิกในครอบครัว ?',
      inputs: [
        {
          name: 'ปู่',
          type: 'radio',
          label: 'ปู่',
          value: 'ปู่'
        },
        {
          name: 'ย่า',
          type: 'radio',
          label: 'ย่า',
          value: 'ย่า'
        },
        {
          name: 'ตา',
          type: 'radio',
          label: 'ตา',
          value: 'ตา'
        },
        {
          name: 'ยาย',
          type: 'radio',
          label: 'ยาย',
          value: 'ยาย'
        },
        {
          name: 'ลุง',
          type: 'radio',
          label: 'ลุง',
          value: 'ลุง'
        },
        {
          name: 'ป้า',
          type: 'radio',
          label: 'ป้า',
          value: 'ป้า'
        },
        {
          name: 'น้า',
          type: 'radio',
          label: 'น้า',
          value: 'น้า'
        },
        {
          name: 'อา',
          type: 'radio',
          label: 'อา',
          value: 'อา'
        },
        {
          name: 'พี่',
          type: 'radio',
          label: 'พี่',
          value: 'พี่'
        },
        {
          name: 'น้อง',
          type: 'radio',
          label: 'น้อง',
          value: 'น้อง'
        },
        {
          name: 'ลูก',
          type: 'radio',
          label: 'ลูก',
          value: 'ลูก'
        },
        {
          name: 'หลาน',
          type: 'radio',
          label: 'หลาน',
          value: 'หลาน'
        },
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'เพิ่มสมาชิก',
          handler: (data) => {
            if (data === undefined) {
              let alert = this.alertCtrl.create({
                title: 'ไม่สำเร็จ',
                subTitle: 'กรุณาเลือกตำแหน่งของสมาชิก',
                buttons: ['ตกลง']
              });
              alert.present();
            } else {
              console.log(data);
              let checkfamily;
              this.firefamily.doc(firebase.auth().currentUser.uid).collection("family").where("uid", "==", item.id).get().then((snapshot) => {
                snapshot.forEach((docs) => {
                  checkfamily = docs;
                })
                if (checkfamily === undefined) {
                  if (data === 'ปู่' || data === 'ย่า' || data === 'ตา' || data === 'ยาย' || data === 'ลุง' || data === 'ป้า' || data === 'น้า' || data === 'อา') {
                    this.statusme = 'หลาน'
                    this.addfamily(item, data, this.statusme);
                  }
                  if (data === 'พ่อ' || data === 'แม่') {
                    this.statusme = 'ลูก';
                    this.addfamily(item, data, this.statusme);
                  }
                  if (data === 'พี่') {
                    this.statusme = 'น้อง';
                    this.addfamily(item, data, this.statusme);
                  }
                  if (data === 'น้อง') {
                    this.statusme = 'พี่';
                    this.addfamily(item, data, this.statusme);
                  }
                  if (data === 'ลูก') {
                    let alert1 = this.alertCtrl.create({
                      title: "ตำแหน่งครอบครัวของเรา",
                      inputs: [
                        {
                          name: 'พ่อ',
                          type: 'radio',
                          label: 'พ่อ',
                          value: 'พ่อ'
                        },
                        {
                          name: 'แม่',
                          type: 'radio',
                          label: 'แม่',
                          value: 'แม่'
                        },
                      ],
                      buttons: [
                        {
                          text: 'เพิ่มสมาชิก',
                          handler: (res) => {
                            this.statusme = res;
                            this.addfamily(item, data, this.statusme);
                          }
                        }
                      ]
                    })
                    alert1.present();
                  }
                  if (data === 'หลาน') {
                    let alert = this.alertCtrl.create({
                      title: "ตำแหน่งครอบครัวของเรา",
                      inputs: [
                        {
                          name: 'ปู่',
                          type: 'radio',
                          label: 'ปู่',
                          value: 'ปู่'
                        },
                        {
                          name: 'ย่า',
                          type: 'radio',
                          label: 'ย่า',
                          value: 'ย่า'
                        },
                        {
                          name: 'ตา',
                          type: 'radio',
                          label: 'ตา',
                          value: 'ตา'
                        },
                        {
                          name: 'ยาย',
                          type: 'radio',
                          label: 'ยาย',
                          value: 'ยาย'
                        },
                        {
                          name: 'ลุง',
                          type: 'radio',
                          label: 'ลุง',
                          value: 'ลุง'
                        },
                        {
                          name: 'ป้า',
                          type: 'radio',
                          label: 'ป้า',
                          value: 'ป้า'
                        },
                        {
                          name: 'น้า',
                          type: 'radio',
                          label: 'น้า',
                          value: 'น้า'
                        },
                        {
                          name: 'อา',
                          type: 'radio',
                          label: 'อา',
                          value: 'อา'
                        },
                      ],
                      buttons: [
                        {
                          text: 'เพิ่มสมาชิก',
                          handler: (res2) => {
                            this.statusme = res2;
                            this.addfamily(item, data, this.statusme);
                          }
                        }
                      ]
                    })
                    alert.present();
                  }
                } else {
                  let alert = this.alertCtrl.create({
                    title: 'เป็นสมาชิกในครอบครัวอยู่แล้ว',
                    buttons: ['ตกลง']
                  });
                  alert.present();
                }

              })
            }
          }
        }
      ]
    })
    alert.present();
  }

}
