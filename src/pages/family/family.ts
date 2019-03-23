import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { FamilybuddysPage } from '../familybuddys/familybuddys';
import { FamilyProvider } from '../../providers/family/family';


@IonicPage()
@Component({
  selector: 'page-family',
  templateUrl: 'family.html',
})
export class FamilyPage {
  myfamilys: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public events : Events,
    public alertCtrl: AlertController,
    public familyservice : FamilyProvider
    ) {
  }

  familybuddys() {
    this.navCtrl.push(FamilybuddysPage);
  }

  getfamilys(){
    this.familyservice.getmyfamilys();
    this.events.subscribe('familys', () => {
      this.myfamilys = this.familyservice.myfamilys;
    })
  }

  ngOnInit() {
    this.getfamilys();
  }
  ngOnDestroy() {
    this.events.unsubscribe('familys');
  }

}
