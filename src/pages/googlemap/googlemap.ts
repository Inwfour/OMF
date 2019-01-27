import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker,
} from '@ionic-native/google-maps'

@IonicPage()
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html',
})
export class GooglemapPage {
  map : GoogleMap;
  locationUser: {
    lat:any,
    long:any
  }
  wathchUser: {
    lat:any,
    long:any
  }
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private googleMaps:GoogleMaps,
    public plt:Platform,

    
    ) {
      // this.geolocation.getCurrentPosition().then((resp) => {
      //  this.locationUser.lat = resp.coords.latitude;
      //   this.locationUser.long = resp.coords.longitude;
      //  }).catch((error) => {
      //    console.log('Error getting location', error);
      //  });
       
      //  let watch = this.geolocation.watchPosition();
      //  watch.subscribe((data) => {
      //   console.log("data (lat) = ", data.coords.latitude);
      //   console.log("data (long) = ", data.coords.longitude);
      //   // data can be a set of coordinates, or an error (if an error occurred).
      //   // data.coords.latitude
      //   // data.coords.longitude
      //  });
  }

  // Location() {

  // }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: 43.0741904,
           lng: -89.3809802
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 43.0741904,
        lng: -89.3809802
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }

  // ionViewWillEnter() {
  //   this.loadMap();
  // }

}
