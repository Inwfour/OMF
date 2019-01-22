import { Component, ElementRef, HostListener, Directive } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController,ActionSheetController } from 'ionic-angular';
import firebase from 'firebase'
import moment from 'moment'
/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
@Directive({
  selector: 'ion-textarea[autosize]' // Attribute selector,
})
export class CommentsPage {

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.resize()
  }

  post: any = {};
  comments: any[] = [];
  text: string = "";
  likesCount:number;
  _uid:any;
  editTextComment:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private loadingCtrl: LoadingController, private toastCtrl: ToastController
    , private actionSheetCtrl:ActionSheetController,private element:ElementRef
    ) {
    this._uid = firebase.auth().currentUser.uid;
    console.log(this._uid)
    this.post = this.navParams.get("post");
    this.getComment();
    this.getLike();
  }

  ngAfterViewInit() {
    this.resize()
  }

  resize() {
    let textArea =
      this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = (textArea.scrollHeight + 16) + "px";
  }

  getLike(){
    firebase.firestore().collection("posts").doc(this.post.id).get().then(data => {
      this.likesCount = data.data().likesCount;
    });
  }

  getComment() {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`,

    });
    loader.present();

    firebase.firestore().collection("comments").where("post", "==", this.post.id)
      .orderBy("created", "asc")
      .get()
      .then((data) => {
        loader.dismiss();
        console.log(data.docs);
        this.comments = data.docs;
      }).catch((err) => {
        loader.dismiss();
        console.log(err);
      })
  }

  sendComment() {

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`

    });

    loader.present();
  
    if (typeof (this.text) == "string" && this.text.length > 0) {
      firebase.firestore().collection("comments").add({
        text: this.text,
        post: this.post.id,
        owner: firebase.auth().currentUser.uid,
        owner_name: firebase.auth().currentUser.displayName,
        created: firebase.firestore.FieldValue.serverTimestamp()
      }).then((doc) => {
        console.log(doc);
        this.text = "";
        loader.dismiss();
        this.getComment();
      }).catch((err) => {
        loader.dismiss();
        console.log(err);
      })
    } else {
      this.toastCtrl.create({
        message: "กรุณากรอกให้ช่องไม่ว่าง",
        duration: 2000,
      }).present();
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  deleteComment(comment){

    let commentCount = this.post.data().commentsCount;

     this.actionSheetCtrl.create({
       title: "คุณต้องการลบคอมเม้น ?",
      buttons: [
        {
          text: "ยืนยัน",
          handler: () => {
            let loader = this.loadingCtrl.create({
              spinner: 'hide',
              content: `<img src="assets/imgs/loading.svg">`
        
            }); loader.present();
            // Delete Comment
            firebase.firestore().collection("comments").doc(comment.id).delete().then(() => {
                        
              firebase.firestore().collection("posts").doc(this.post.id).update({
              "commentsCount": commentCount - 1
            }).then(() => {
              loader.dismiss();  
              commentCount = this.post.data().commentCount;
              this.getComment();
            }).catch(err => {
              console.log(err);
            });
            }).catch(err => {
              console.log(err);
            });
            // Update CommentCount - 1

          }
        },
        {
          text: "กลับ",
          handler: () => {
             console.log("ไม่ได้ลบข้อมูล");
          }
        }
      ]
    }).present();

  }

  editComment(comment){

  }
}
