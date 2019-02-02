import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , Events} from 'ionic-angular';
import { RequestsProvider } from '../../providers/requests/requests';

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  myrequest:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public requestservice:RequestsProvider,
    public events:Events 
    ) {
      this.requestservice.getmyrequests();
      this.events.subscribe('gotrequests', () => {
        this.myrequest = this.requestservice.userdetails;
        console.log(this.myrequest);
      })
  }

  ionViewWillEnter() {

  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
  }


    


}
