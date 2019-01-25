import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the EditCommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-comment',
  templateUrl: 'edit-comment.html',
})
export class EditCommentPage {
  comment: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController) {
    this.comment = this.navParams.get("comment");
    console.log(this.comment.data().text);
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
