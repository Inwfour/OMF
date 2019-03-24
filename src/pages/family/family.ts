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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public events : Events,
    public alertCtrl: AlertController,
    public familyservice : FamilyProvider,
    private actionSheetCtrl : ActionSheetController,
    private toastCtrl:ToastController
    ) {
      
  }

  ionViewDidLoad(){
    this.getfamilys();
  }

  familybuddys() {
    this.navCtrl.push(FamilybuddysPage);
  }

  getfamilys(){
    this.familyservice.getmyfamilys().then((data) => {
      this.myfamilys = data;
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
                {
                  name: 'เหลน',
                  type: 'radio',
                  label: 'เหลน',
                  value: 'เหลน'
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
                    if(data === undefined){
                      let alert = this.alertCtrl.create({
                        title: 'ไม่สำเร็จ',
                        subTitle: 'กรุณาเลือกตำแหน่งของสมาชิก',
                        buttons: ['ตกลง']
                      });
                      alert.present();
                    }else {
                      this.familyservice.edittype(key, data).then(() => {
                        this.toastCtrl.create({
                          message: "แก้ไขเรียบร้อยแล้ว",
                          duration: 2000
                        }).present();
                      })
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
