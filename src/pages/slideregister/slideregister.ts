import { Component, trigger, transition, style, state, animate, keyframes, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , Slides ,Events, LoadingController} from 'ionic-angular';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';
@IonicPage()
@Component({
  selector: 'page-slideregister',
  templateUrl: 'slideregister.html',
  animations: [
    
    trigger('bounce', [
          state('*', style({
              transform: 'translateX(0)'
          })),
          transition('* => rightSwipe', animate('700ms ease-out', keyframes([
            style({transform: 'translateX(0)', offset: 0}),
            style({transform: 'translateX(-65px)',  offset: 0.3}),
            style({transform: 'translateX(0)',     offset: 1.0})
          ]))),
          transition('* => leftSwipe', animate('700ms ease-out', keyframes([
            style({transform: 'translateX(0)', offset: 0}),
            style({transform: 'translateX(65px)',  offset: 0.3}),
            style({transform: 'translateX(0)',     offset: 1.0})
          ])))
      ])
    ]
})
export class SlideregisterPage {
  @ViewChild(Slides) slides: Slides;
  fireuser = firebase.firestore().collection("informationUser");
  skipMsg: string = "Skip";
  state: string = 'x';
  name:string = "";
  age:number;
  phone:number;
  health:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public events:Events,
    public loadingCtrl: LoadingController
    ) {
      this.name = firebase.auth().currentUser.displayName;
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true)
  }

  skip() {
    this.navCtrl.push(HomePage);
  }

  next() {

    if(this.name == "" || this.name == null){
      this.slides.lockSwipes(true);
    }else {
      firebase.auth().currentUser.updateProfile({
        displayName: this.name,
        photoURL: firebase.auth().currentUser.photoURL
      }).then(() => {
        this.fireuser.doc(firebase.auth().currentUser.uid).update ({
          owner_name : this.name
        }).then(() => {
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
        })
      })
    }
  }

  nextage() {

    if(this.age == 0 || this.age == null){
      this.slides.lockSwipes(true);
    }else {
        this.fireuser.doc(firebase.auth().currentUser.uid).update ({
          age : this.age
        }).then(() => {
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
        })
    }
  }

  nextphone() {

        this.fireuser.doc(firebase.auth().currentUser.uid).update ({
          phone : this.phone
        }).then(() => {
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
        })
  }

  nexthealth() {

        this.fireuser.doc(firebase.auth().currentUser.uid).update ({
          disease : this.health
        }).then(() => {
          this.slides.lockSwipes(false);
          this.navCtrl.setRoot(TabsPage)
          this.slides.lockSwipes(true);
        })
  }

  slideChanged() {
    if (this.slides.isEnd())
      this.skipMsg = "Alright, I got it";
  }

  //slideregister.html ion-slides : (ionSlideDrag)="slideMoved()"

  // slideMoved() {
  //   if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex()) 
  //     this.state = 'rightSwipe';
  //   else 
  //     this.state = 'leftSwipe';
  // }

  animationDone() {
    this.state = 'x';
  }

  logout() {
    firebase.auth().signOut().then((data) => {
      console.log(data);
      this.events.publish('user:logout');
      firebase.firestore().disableNetwork();
    })
  }

}
