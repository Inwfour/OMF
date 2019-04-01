import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
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
  lat: any;
  lng: any;
  user: any;
  allfamilys:any;
  allresfamilys:any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public familyservice: FamilyProvider,
    public modalCtrl: ModalController,
    public events: Events,
    public zone : NgZone
  ) { }

  ionViewWillEnter() {
 
    this.showMap();
  }

  ionViewWillLeave() {
    this.events.unsubscribe('infofamilys');
  }

  // modalfamily() {
  //   let modalPage = this.modalCtrl.create(GooglemapmodalPage)
  //   modalPage.onDidDismiss(data => {
  //     this.lat= 0;
  //     this.lng= 0;
  //     console.log('test :' , data);
  //     this.user = data.user;
  //     this.lat = data.lat;
  //     this.lng = data.lng;
  //     console.log(this.lat);
  //     console.log(this.lng);
  //     this.showMap();
  //   });
  //   modalPage.present();
  // }


  showMap() {
    firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid).get().then( async(res) => {
      const locationme = await new google.maps.LatLng(res.data().location.latitude, res.data().location.longitude);
      const options = {
        center: locationme,
        zoom: 14,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);

      var date = new Date(this.allresfamilys.createlocation);
      var infowindow = new google.maps.InfoWindow({
        content: res.data().owner_name + "<br>" + date
      });
      var marker = new google.maps.Marker({
        position: locationme,
        map: this.map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        label: "ฉัน",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
          size: {
            width: 30,
            height: 35
          }
        },
      })
      marker.addListener('click', function () {
       infowindow.open(this.map, marker)
      })

      this.familyservice.getinfofamilys();
      this.events.subscribe('infofamilys', () => {
        this.allfamilys;
        this.zone.run(() => {
          this.allfamilys = this.familyservice.infofamilys;
          for(var key in this.allfamilys){
            if(this.allfamilys[key].location){
              this.allresfamilys = this.allfamilys[key];
              console.log(this.allresfamilys.owner_name);
              var datebuddy = new Date(this.allresfamilys.createlocation);
              var marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.allresfamilys.location.latitude,this.allresfamilys.location.longitude),
                map: this.map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                label: "เพื่อน",
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  size: {
                    width: 30,
                    height: 35
                  }
                },
              })
              var infowindow = new google.maps.InfoWindow({
                content: this.allresfamilys.owner_name + "<br>" + datebuddy
              });
              marker.addListener('click', function () {
              
               infowindow.open(this.map, marker)
              })

              console.log(this.allresfamilys.location.latitude);
            }
          }
        })
      })
    })
      
  }


}
