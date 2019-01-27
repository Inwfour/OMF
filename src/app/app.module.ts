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
import { HttpClientModule } from '@angular/common/http';
import { CommentsPage } from '../pages/comments/comments';
import { Firebase } from '@ionic-native/firebase';
import { GoogleMaps } from '@ionic-native/google-maps';
import { GooglemapPage } from '../pages/googlemap/googlemap';
import { CollectionServicesProvider } from '../providers/get-collections/get-collections';
import { EditPostPage } from '../pages/edit-post/edit-post';
import { EditCommentPage } from '../pages/edit-comment/edit-comment';
import { TabsCameraPage } from '../pages/tabs-camera/tabs-camera';

firebase.initializeApp(FIREBASE_CONFIG);
firebase.firestore().settings( { timestampsInSnapshots: true })

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ChatbotPage,
    TabsPage,
    UserPage,
    FeedPage,
    CommentsPage,
    GooglemapPage,
    EditPostPage,
    EditCommentPage,
    TabsCameraPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
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
    FeedPage,
    CommentsPage,
    GooglemapPage,
    EditPostPage,
    EditCommentPage,
    TabsCameraPage
  ],
  providers: [
    StatusBar,
    Firebase,
    SplashScreen,
    GoogleMaps,
    TextToSpeech,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    CollectionServicesProvider
  ]
})
export class AppModule {}
