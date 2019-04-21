import { Component ,NgZone,ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams , Events, Content , AlertController, ActionSheetController} from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';
import { ImageProvider } from '../../providers/image/image';
@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  buddy:any;
  newmessage:any;
  allmessages = [];
  photoURL:any;
  image:string = "";
  firebuddychats = firebase.firestore().collection('buddychats');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public chatservice:ChatProvider,
    public events:Events,
    public zone:NgZone,
    public alertCtrl:AlertController,
    public actionSheetCtrl:ActionSheetController,
    public _IMG : ImageProvider
    ) {
      this.photoURL = firebase.auth().currentUser.photoURL;
      this.buddy = this.chatservice.buddy;
      this.getmessage();
  }

  ngOnDestroy() {
    this.events.unsubscribe('newmessage');
  }

  addmessage() {
    if(this.newmessage == "" && this.newmessage == null){
      console.log("null");
    }else{
    this.chatservice.addnewmessage(this.newmessage,this.image).then(() => {
      this.newmessage = '';
      this.image = undefined;

      this.ionViewDidEnter();
    })
  }
  }

  // onFocus() {
  //   this.showEmojiPicker = false;
  //   this.content.resize();
  //   this.scrollToBottom();
  // }

  ionViewDidEnter() {
    this.scrollto();
    this.chatservice.getbuddymessages();
          this.events.subscribe('newmessage', () => {
        this.allmessages = [];
        this.zone.run(() => {
          this.allmessages = this.chatservice.buddymessages;
        })
      })
  }

  getmessage() {
    this.firebuddychats.doc(firebase.auth().currentUser.uid).collection("buddys").doc(this.buddy.id).collection('buddy')
    .orderBy("timestamp")
    .onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type === "added") {
          // TODO
          console.log("add " , change.doc.id);
          this.ionViewDidEnter();
        }
      });
    })
  }

  scrollto() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  sendPicMsg() {
    let alert = this.actionSheetCtrl.create({
      title: "คุณต้องการรูปในลักษณะใด ?",
      buttons: [
        {
          text: "กล้องถ่ายรูป",
          handler: () => {
            this._IMG.camera().then(data => {
              this.image = data;
            })
          }
        },
        {
          text: "เลือกจากอัลบั้มรูปภาพ",
          handler: () => {
            this._IMG.selectImage().then(data => {
              this.image = data;
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

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(200);
      }
    }, 400)
  }



  remove(msg) {
    this.alertCtrl.create({
      title: "คุณต้องการลบข้อความนี้หรือไม่ ?",
      buttons: [
        {
          text: "ไม่ตกลง"
        },
        {
          text: "ตกลง",
          handler: () => {
            this.chatservice.remove(msg).then(() => {
              this.ionViewDidEnter();
            })
          }
        }
      ]
    }).present();
  }

  removeall() {
    this.alertCtrl.create({
      title: "คุณต้องการลบข้อความทั้งหมดหรือไม่ ?",
      buttons: [
        {
          text: "ไม่ตกลง"
        },
        {
          text: "ตกลง",
          handler: () => {
            this.chatservice.removeall().then(() => {
              this.ionViewDidEnter();
            })
          }
        }
      ]
    }).present();
  }
}
