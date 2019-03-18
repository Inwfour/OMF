import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HelpfamilyPage } from '../helpfamily/helpfamily';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  phone:number;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController
    ) {
  }

  helpfamily(){
    this.modalCtrl.create(HelpfamilyPage).present();
  }

}
