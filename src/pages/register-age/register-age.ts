import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterDiseasePage } from '../register-disease/register-disease';

/**
 * Generated class for the RegisterAgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-age',
  templateUrl: 'register-age.html',
})
export class RegisterAgePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterAgePage');
  }

  
  back() {
    this.navCtrl.pop();
  }

  next(){
    this.navCtrl.push(RegisterDiseasePage);
  }

}
