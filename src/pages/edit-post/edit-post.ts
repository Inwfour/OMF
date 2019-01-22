import { Component,Directive, HostListener, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import firebase from 'firebase';
/**
 * Generated class for the EditPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-post',
  templateUrl: 'edit-post.html',
})
@Directive({
  selector: 'ion-textarea[autosize]' // Attribute selector,
    })
export class EditPostPage {

  @HostListener('document:keydown.enter', ['$event']) 
  onKeydownHandler(evt: KeyboardEvent) {
  this.adjust()
  }

  post: any = {};
  textEdit:any;
  constructor(public element:ElementRef,public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController) {
    this.post = this.navParams.get("post");
    console.log(this.post.id);
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
    firebase.firestore().collection("posts").doc(this.post.id).update({
      "text": this.textEdit
    }).then(() => {
        this.close();
    }).catch((err) => {
      console.log(err)
    });
  }

}
