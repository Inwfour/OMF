import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { SettingallalarmPage } from '../settingallalarm/settingallalarm';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform
    ) {
  }

  about() {
    this.navCtrl.push(AboutPage);
  }
  settingalarm() {
    this.navCtrl.push(SettingallalarmPage);
  }

}
