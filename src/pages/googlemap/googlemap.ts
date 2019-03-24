import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

declare var google:any;

@IonicPage()
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html',
})
export class GooglemapPage {

  @ViewChild('map') mapRef : ElementRef
  map:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    ) {}

    ionViewDidLoad(){
      this.showMap();
    }

    showMap() {

      const location = new google.maps.LatLng(51.222,-1.333);
      const options = {
        center: location,
        zoom: 10,
        streetViewControl: false,
        mapTypeId:'satellite'
      };
      this.map = new google.maps.Map(this.mapRef.nativeElement,options);
      this.addMarker(location,this.map);
    }

    addMarker(position,map) {
      return new google.maps.Marker({
        position,
        map
      });
    }


}
