import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { timer } from 'rxjs/observable/timer';
import { TabsPage } from '../pages/tabs/tabs';
import firebase from 'firebase'

declare var window;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  showSplash = true;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user);
        if (user) {
          this.rootPage = TabsPage;
          }  else {
          this.rootPage = LoginPage;
        }
    });


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      timer(3000).subscribe(() => this.showSplash = false)

      //Key chatbot >>>>>>>>>>>

        window["ApiAIPlugin"].init(
          {
              clientAccessToken: "fe95cf69c3ab4cae9df66de9f27ce5f7", // insert your client access key here
              lang: "en" // set lang tag from list of supported languages
          }, 
          function(result) { 
            // alert(result);
           },
          function(error) { 
            alert(error);
           }
      );

    });
  }
}

