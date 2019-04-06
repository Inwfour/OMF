import { Component, NgZone } from '@angular/core';
import { Platform, Events, LoadingController, Loading, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { timer } from 'rxjs/observable/timer';
import { TabsPage } from '../pages/tabs/tabs';
import firebase from 'firebase'
import { NetworkProvider } from '../providers/network/network';
import { Network } from '@ionic-native/network';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

declare var window;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  showSplash = true;
  public lat: number = 0;
public lng: number = 0; 
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public network: Network,
    public networkProvider: NetworkProvider,
    public events: Events,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public zone:NgZone,
  ) {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.rootPage = LoginPage;
        unsubscribe();
      } else {
        this.rootPage = TabsPage;
        unsubscribe();
      }
    });


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      timer(3000).subscribe(() => this.showSplash = false)

      firebase.auth().onAuthStateChanged(user => {
        console.log(user);
        if(user){
          console.log("if");
          let options = {
            timeout: 5000,
            maximumAge: 0
          };

          var watch = this.geolocation.watchPosition(options);
          var subscribtion = this.geolocation.watchPosition(options).subscribe((data: Geoposition) => {
            this.zone.run(async () => {
              this.lat = await data.coords.latitude;
              this.lng = await data.coords.longitude;
          await firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid)
            .update({
              location: new firebase.firestore.GeoPoint(data.coords.latitude,data.coords.longitude),
              createlocation: firebase.firestore.FieldValue.serverTimestamp()
            })
            console.log("lat : " + this.lat);
            console.log("lng : " + this.lng);
            })
          });
        }else{
          console.log("else");
        }
      })
      //Key chatbot >>>>>>>>>>>

      //   window["ApiAIPlugin"].init(
      //     {
      //         clientAccessToken: "fe95cf69c3ab4cae9df66de9f27ce5f7", // insert your client access key here
      //         lang: "en" // set lang tag from list of supported languages
      //     }, 
      //     function(result) { 
      //       // alert(result);
      //      },
      //     function(error) { 
      //       alert(error);
      //      }
      // );

      // Check Internet
      this.networkProvider.initializeNetworkEvents();
      // var loading = this.loadingCtrl.create({
      //   content: 'เครื่อข่ายล้มเหลวกรุณารอการเชื่อมต่อ'
      // });

      // Offline event
      this.events.subscribe('network:offline', () => {
        // loading.present();
        alert('network:offline ==> ' + this.network.type);
      });

      // Online event
      this.events.subscribe('network:online', () => {
        // loading.dismiss();
        alert('network:online ==> ' + this.network.type);
      });

    });
  }
}

