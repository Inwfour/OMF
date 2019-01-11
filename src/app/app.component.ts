import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { timer } from 'rxjs/observable/timer';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../pages/tabs/tabs';

declare var window;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  showSplash = true;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,afAuth:AngularFireAuth) {

    afAuth.authState.subscribe((user) => {
      if (user && user.uid){
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
    });
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      timer(3000).subscribe(() => this.showSplash = false);



      
    //Key chatbot >>>>>>>>>>>

    //   window["ApiAIPlugin"].init(
    //     {
    //         clientAccessToken: "23ea47bac3b34507bcb0bd45a2325355", // insert your client access key here
    //         lang: "th" // set lang tag from list of supported languages
    //     }, 
    //     function(result) { 
    //       // alert(result);
    //      },
    //     function(error) { 
    //       alert(error);
    //      }
    // );

    });
  }
}

