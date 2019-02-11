import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker,
} from '@ionic-native/google-maps'
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html',
})
export class GooglemapPage {
  map : GoogleMap;
    lat:any = 0;
    long:any = 0;
  photoURL:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private googleMaps:GoogleMaps,
    public plt:Platform,
    private geolocation: Geolocation
    ) {      
      this.photoURL = firebase.auth().currentUser.photoURL;
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

  ngAfterViewInit(){
    this.geolocation.getCurrentPosition().then((resp) => {
          this.lat = resp.coords.latitude;
           this.long = resp.coords.longitude;
         console.log("lat " + this.lat);
         console.log("long " + this.long);
         this.loadMap();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: this.lat,
           lng: this.long
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: { url : '../../assets/imgs/user.png'},
      animation: 'DROP',
      position: {
        lat: this.lat,
        lng: this.long
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }

}
