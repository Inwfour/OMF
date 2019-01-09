import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,private loadingCtrl:LoadingController) {
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

close(){
  this.viewCtrl.dismiss();
}
ago(time) {
  let difference = moment(time).diff(moment());
  return moment.duration(difference).humanize();
}
}
