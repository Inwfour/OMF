import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { ImageProvider } from '../../providers/image/image';
import { GroupsProvider } from '../../providers/groups/groups';

@IonicPage()
@Component({
  selector: 'page-newgroup',
  templateUrl: 'newgroup.html',
})
export class NewgroupPage {
  newgroup = {
    groupName: 'ชื่อกลุ่ม',
    groupPic: 'assets/imgs/user.png'
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl : AlertController,
    public actionSheetCtrl : ActionSheetController,
    public _IMG : ImageProvider,
    public groupservice: GroupsProvider
    ) {
  }

  chooseimage() {
    let alert = this.actionSheetCtrl.create({
      title: "คุณต้องการรูปในลักษณะใด ?",
      buttons: [
        {
          text: "กล้องถ่ายรูป",
          handler: () => {
            this._IMG.camera().then(data => {
              this.newgroup.groupPic = data;
            })
          }
        },
        {
          text: "เลือกจากอัลบั้มรูปภาพ",
          handler: () => {
            this._IMG.selectImage().then(data => {
              this.newgroup.groupPic = data;
            })
          }
        },
        {
          text: "กลับ",
          handler: () => {
            console.log("ไม่ได้ลบข้อมูล");
          }
        }
      ]
    });
    alert.present();
  }

  creategroup() {
    this.groupservice.addgroup(this.newgroup).then(() => {
      this.navCtrl.pop();
    }).catch(err => {
      alert(JSON.stringify(err));
    })
  }

  editgroupname() {
    let alert = this.alertCtrl.create({
      title: 'แก้ไขชื่อกลุ่ม',
      inputs: [{
        name: 'groupName',
        placeholder: 'กรอกชื่อกลุ่มขอบคุณ'
      }],
      buttons: [{
        text: 'ออก',
        role: 'cancel',
        handler: data => {
 
        }
      },
      {
        text: 'ยืนยัน',
        handler: data => {
          if (data.groupName) {
            this.newgroup.groupName = data.groupName
          }
 
          else {
            this.newgroup.groupName = 'ชื่อกลุ่ม';
          }
        }
      }
      ]
    });
    alert.present();
  }

}
