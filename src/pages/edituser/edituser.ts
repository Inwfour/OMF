import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-edituser',
  templateUrl: 'edituser.html',
})
export class EdituserPage {
  user:any = [];
  _uid:any;
  dis:any = [];
  checkdiabetes:string = "";
  checkpress:string = "";

  fireinfo = firebase.firestore().collection("informationUser");
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private _USER: UserProvider,
    private alertCtrl:AlertController
    ) {
      this._uid = firebase.auth().currentUser.uid;
      this.getUserEdit();
  }


  getUserEdit() {
    this._USER.getInformationUser(this._uid).then(data => {
      this.user = data;
      // console.log(this.user);
      firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid).get()
      .then((res) => {
        for(let i = 0; i < res.data().disease.length;i++) {
          if(res.data().disease[i] == "โรคเบาหวาน"){
            this.checkdiabetes = res.data().disease[i];
            console.log(this.checkdiabetes);
          }else{
            this.checkdiabetes = "";
          }
          if(res.data().disease[i] == "โรคความดันโลหิตสูง"){
             this.checkpress = res.data().disease[i];
             console.log(this.checkpress);
          }else{
            this.checkpress = "";
          }
        }
      })
    })
    

    let user = firebase.firestore().collection("informationUser")
    .where("owner", "==", this._uid)

  user.onSnapshot((snapshot) => {
    let changedDocs = snapshot.docChanges();

    changedDocs.forEach((change) => {
      if (change.type == "modified") {

        // Edit posts 
        firebase.firestore().collection("posts").where("owner", "==", this._uid)
        .get()
        .then(data => {
          if(data != undefined){
            data.forEach((docs) => {
                console.log("update post",docs.id);
                firebase.firestore().collection("posts").doc(docs.id).update({
                    owner_name: change.doc.data().owner_name
                })
            })
          }
        })
        

        // Edit comments
        firebase.firestore().collection("comments").where("owner", "==", this._uid)
        .get()
        .then(data => {
          if(data != undefined){
          data.forEach((docs) => {
            console.log("update comments",docs.id);
            firebase.firestore().collection("comments").doc(docs.id).update({
                owner_name: change.doc.data().owner_name
            })
        })
      }
        })

        //Edit Family owner_name
        firebase.firestore().collection("familys").doc(firebase.auth().currentUser.uid).collection("family").get().then((data) => {
          if(data != undefined) {
            data.forEach((docs) => {
              firebase.firestore().collection("familys").doc(docs.data().uid).collection("family").get().then((snapshot) => {
                snapshot.forEach((doc) => {
                  firebase.firestore().collection("familys").doc(docs.data().uid).collection("family").doc(doc.id).update({
                    owner_name: change.doc.data().owner_name,
                    phone: change.doc.data().phone
                  })
                })
              })
            })
          }
        })
        
      }
    })
  })
  }

  edituser(){
    this._USER.editUser(this.user).then(async () => {
      this.alertCtrl.create({
        title: 'บันทึกสำเร็จแล้ว',
        buttons:['ตกลง']
      }).present();
      this.getUserEdit();
    })
  }

  editdisease() {
    let alert = this.alertCtrl.create({
      title: 'ตำแหน่งของสมาชิกในครอบครัว ?',
      inputs: [
        {
          name: 'โรคความดันโลหิตสูง',
          type: 'checkbox',
          label: 'โรคความดันโลหิตสูง',
          value: 'โรคความดันโลหิตสูง'
        },
        {
          name: 'โรคเบาหวาน',
          type: 'checkbox',
          label: 'โรคเบาหวาน',
          value: 'โรคเบาหวาน'
        },
        {
          name: 'โรคอัลไซเมอร์',
          type: 'checkbox',
          label: 'โรคอัลไซเมอร์',
          value: 'โรคอัลไซเมอร์'
        },
        {
          name: 'โรคข้อเสื่อม',
          type: 'checkbox',
          label: 'โรคข้อเสื่อม',
          value: 'โรคข้อเสื่อม'
        },
        {
          name: 'โรคซึมเศร้า',
          type: 'checkbox',
          label: 'โรคซึมเศร้า',
          value: 'โรคซึมเศร้า'
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
          text: 'ยืนยันการแก้ไข',
          handler: (data) => {  
            this.user.disease = data;
          }
        }
      ]
    })
    alert.present();
  }

}
