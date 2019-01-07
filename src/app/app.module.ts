import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { FIREBASE_CONFIG } from './firebase.config';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ChatbotPage } from '../pages/chatbot/chatbot';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { TabsPage } from '../pages/tabs/tabs';
import { UserPage } from '../pages/user/user';
import firebase from 'firebase';
import { FeedPage } from '../pages/feed/feed';
import { Camera } from '@ionic-native/camera';

import { HttpModule } from '@angular/http';

firebase.initializeApp(FIREBASE_CONFIG);
firebase.firestore().settings({
  timestampsInSnapshots:true
})

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ChatbotPage,
    TabsPage,
    UserPage,
    FeedPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      // scrollAssist: true,
      // autoFocusAssist: true 
      tabsHideOnSubPages: true,
    }),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ChatbotPage,
    TabsPage,
    UserPage,
    FeedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TextToSpeech,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera
  ]
})
export class AppModule {}
