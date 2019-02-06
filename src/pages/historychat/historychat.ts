import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';

@IonicPage()
@Component({
  selector: 'page-historychat',
  templateUrl: 'historychat.html',
})
export class HistorychatPage {
  myfriendschat:any = [];
  myfriends:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public requestservice: RequestsProvider,
              public events: Events
    ) {
  }

  ngOnInit() {
    this.requestservice.getmyfriendchat();
    this.events.subscribe('friendschat', () => {
      this.myfriends = this.requestservice.myfriends;
      console.log(this.myfriends);
    })
  }

  ngOnDestroy() {
    this.events.unsubscribe('friendschat');
  }

}
