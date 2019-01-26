import { Component, Directive, HostListener, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import firebase from 'firebase';
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
@Directive({
  selector: 'ion-textarea[autosize]' // Attribute selector,
    })
export class EditCommentPage {

  @HostListener('document:keydown.enter', ['$event']) 
  onKeydownHandler(evt: KeyboardEvent) {
  this.adjust()
  }

  comment: any = {};
  textEdit:string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl:ViewController,
    public element:ElementRef
    ) {
    this.comment = this.navParams.get("comment");
    console.log(this.comment.data().text);
  }

  ngAfterViewInit(){
    this.adjust()
    }
 
   adjust():void {
   let textArea = 
   this.element.nativeElement.getElementsByTagName('textarea')[0];
   textArea.style.overflow = 'hidden';
   textArea.style.height = 'auto';
   textArea.style.height = (textArea.scrollHeight + 32) + "px";
   }

  close() {
    this.viewCtrl.dismiss();
  }

  edit(){
    firebase.firestore().collection("comments").doc(this.comment.id).update({
      "text": this.textEdit
    }).then(() => {
        this.close();
    }).catch((err) => {
      console.log(err)
    });
  }

}
