import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController,ToastController } from 'ionic-angular';
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
export class CommentsPage {
  post: any = {};
  comments : any[] = [];
  text:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,private loadingCtrl:LoadingController,private toastCtrl:ToastController) {
   
      this.getComment();
  }

getComment(){
  let loader = this.loadingCtrl.create({
    spinner: 'hide',
    content: `<img src="assets/imgs/loading.svg">`,
    
  });
  loader.present();
  this.post = this.navParams.get("post");
  console.log(this.post);

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

sendComment(){
if(typeof(this.text) == "string" && this.text.length > 0){
  firebase.firestore().collection("comments").add({
    text: this.text,
    post: this.post.id,
    owner: firebase.auth().currentUser.uid,
    owner_name: firebase.auth().currentUser.displayName,
    created: firebase.firestore.FieldValue.serverTimestamp()
  }).then((doc) => {
    console.log(doc);
    this.text = "";
    this.getComment();
  }).catch((err) => {
    console.log(err);
  })
}else{
  this.toastCtrl.create({
    message: "กรุณากรอกให้ช่องไม่ว่าง",
    duration: 2000,
  }).present();
}
}

close(){
  this.viewCtrl.dismiss();
}
ago(time) {
  let difference = moment(time).diff(moment());
  return moment.duration(difference).humanize();
}
}
