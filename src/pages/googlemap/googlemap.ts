import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events, ModalController } from 'ionic-angular';
import firebase from 'firebase';
import { RequestsProvider } from '../../providers/requests/requests';
import { GroupsProvider } from '../../providers/groups/groups';
import { FamilyProvider } from '../../providers/family/family';
import { GooglemapmodalPage } from '../googlemapmodal/googlemapmodal';
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html',
})
export class GooglemapPage {

  @ViewChild('map') mapRef: ElementRef
  map: any;
  myfamilys: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public familyservice: FamilyProvider,
    public modalCtrl : ModalController
  ) { }

  ionViewWillEnter() {
    this.getfamilys();
    this.showMap();

  }

  getfamilys() {
    this.familyservice.getmyfamilys().then((data) => {
      this.myfamilys = data;
    })

  }

  modalfamily() {
    this.modalCtrl.create(GooglemapmodalPage).present();
  }


  showMap() {

      const location = new google.maps.LatLng(12.999999, 15.000000);
      const options = {
        center: location,
        zoom: 10,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      this.addMarker(location, this.map);
  }

  addMarker(position, map) {
    return new google.maps.Marker({
      position,
      map
    });
  }


}
