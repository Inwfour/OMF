import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { UserPage } from '../user/user';
import { TabsCameraPage } from '../tabs-camera/tabs-camera';
import { FriendsPage } from '../friends/friends';
import { TabsfriendsPage } from '../tabsfriends/tabsfriends';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  homePage = HomePage;
  userPage = UserPage;
  settingPage = SettingsPage
  cameraPage = TabsCameraPage
  tabsFriendPage = TabsfriendsPage  
  image:string = "";
  // checked:number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public events:Events,
    public modalCtrl:ModalController
    ) {
      // this.checked = this.navParams.get("check");
      // if(this.checked) {
      //   this.checked = 0;
      // }else{
      //   this.checked = this.checked
      // }

        events.subscribe('user:logout', () => {
          this.navCtrl.setRoot(LoginPage);
        })
  }

  tabsCamera() {
    this.modalCtrl.create(TabsCameraPage).present();
  }


}
