import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HelpfamilyPage } from '../helpfamily/helpfamily';
import { NativeAudio } from '@ionic-native/native-audio';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
  phone:number;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private modalCtrl: ModalController,
    public nativeAudio: NativeAudio
    ) {
      this.nativeAudio.preloadComplex('1', 'assets/sound/help.mp3',1,1,0).then(()=>{
        console.log('Preload Playing');
      });
  }

  helpfamily(){
    this.modalCtrl.create(HelpfamilyPage).present();
  }
  
  sound() {
    this.nativeAudio.play('1').then(()=>{console.log('Playing')});
  }

  stop() {
    this.nativeAudio.stop('1').then(()=>{console.log('Playing')});
  }
}
