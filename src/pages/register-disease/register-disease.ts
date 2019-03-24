import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the RegisterDiseasePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-disease',
  templateUrl: 'register-disease.html',
})
export class RegisterDiseasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterDiseasePage');
  }

  back() {
    this.navCtrl.pop();
  }

  next(){
    this.navCtrl.setRoot(TabsPage);
  }

}
