import { Component, NgZone } from '@angular/core';
import { Platform, Events, LoadingController, Loading, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { timer } from 'rxjs/observable/timer';
import { TabsPage } from '../pages/tabs/tabs';
import firebase from 'firebase'
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

      firebase.auth().onAuthStateChanged(async user => {
        console.log(user);
        if(user){
          console.log("if");

          var watch = await this.geolocation.watchPosition();
          watch.subscribe(async (data: Geoposition) => {
           await this.zone.run(() => {
              if(data.coords.latitude != undefined && data.coords.longitude != undefined){
              this.lat = data.coords.latitude;
              this.lng = data.coords.longitude;
          firebase.firestore().collection("informationUser").doc(firebase.auth().currentUser.uid)
            .update({
              location: new firebase.firestore.GeoPoint(data.coords.latitude,data.coords.longitude),
              createlocation: firebase.firestore.FieldValue.serverTimestamp()
            })
            console.log("lat : " + this.lat);
            console.log("lng : " + this.lng);
          }else {
            console.log("ไม่มีข้อมูล");
          }
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

       this.network.onDisconnect().subscribe(() => {
        alert("กรุณาเชื่อมต่ออินเทอร์เน็ต")
      })

      this.network.onConnect().subscribe(() => {
        alert("เชื่อมต่ออินเทอร์เน็ตสำเร็จ")
      })



    });
  }
}

