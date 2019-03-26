import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { FamilybuddysPage } from '../familybuddys/familybuddys';
import { FamilyProvider } from '../../providers/family/family';


@IonicPage()
@Component({
  selector: 'page-family',
  templateUrl: 'family.html',
})
export class FamilyPage {
  myfamilys: any = [];
  statusme: any = "";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public events: Events,
    public alertCtrl: AlertController,
    public familyservice: FamilyProvider,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) {

  }

  ionViewWillEnter() {
    this.getfamilys();
  }

  familybuddys() {
    this.navCtrl.push(FamilybuddysPage);
  }

  getfamilys() {
    this.familyservice.getmyfamilys().then((data) => {
      this.myfamilys = data;
    })

  }

  updatefamily(key, data, statusme) {
    this.familyservice.edittype(key, data, statusme).then(() => {
      this.toastCtrl.create({
        message: "แก้ไขเรียบร้อยแล้ว",
        duration: 2000
      }).present();
      this.getfamilys();
    })
  }

  settings(key) {
    let alert = this.actionSheetCtrl.create({
      title: "จัดการสมาชิก ?",
      buttons: [
        {
          text: "แก้ไขตำแหน่งสมาชิก",
          handler: () => {
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
                  text: 'ยีนยัน',
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
                      if (data === 'ปู่' || data === 'ย่า' || data === 'ตา' || data === 'ยาย' || data === 'ลุง' || data === 'ป้า' || data === 'น้า' || data === 'อา') {
                        this.statusme = 'หลาน'
                        this.updatefamily(key, data, this.statusme);
                      }
                      if (data === 'พ่อ' || data === 'แม่') {
                        this.statusme = 'ลูก';
                        this.updatefamily(key, data, this.statusme);
                      }
                      if (data === 'พี่') {
                        this.statusme = 'น้อง';
                        this.updatefamily(key, data, this.statusme);
                      }
                      if (data === 'น้อง') {
                        this.statusme = 'พี่';
                        this.updatefamily(key, data, this.statusme);
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
                                this.updatefamily(key, data, this.statusme);
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
                                this.updatefamily(key, data, this.statusme);
                              }
                            }
                          ]
                        })
                        alert.present();
                      }
                    }
                  }
                }
              ]
            })
            alert.present();
          }
        },
        {
          text: "ลบข้อมูล",
          handler: () => {
            this.familyservice.deletefamily(key).then(() => {
              this.toastCtrl.create({
                message: "ลบสมาชิกเรียบร้อยแล้ว",
                duration: 2000
              }).present();
              this.getfamilys();
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

}
