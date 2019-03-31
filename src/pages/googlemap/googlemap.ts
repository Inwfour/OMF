import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import firebase from 'firebase';
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html',
})
export class GooglemapPage {

  @ViewChild('map') mapRef: ElementRef
  map: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
  ) { }

  ionViewWillEnter() {

    this.showMap();

  }


  showMap() {
    firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid).get().then(async(data) => {
      console.log(data.data().location.latitude);
      console.log(data.data().location.longitude);
      const location = await new google.maps.LatLng(data.data().location.latitude, data.data().location.longitude);
      const options = {
        center: location,
        zoom: 10,
        streetViewControl: false,
        mapTypeId: 'satellite'
      };
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      this.addMarker(location, this.map);
    })
  }

  addMarker(position, map) {
    return new google.maps.Marker({
      position,
      map
    });
  }


}
