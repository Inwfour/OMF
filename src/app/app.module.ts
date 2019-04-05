import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, group } from '@angular/core';
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
import { ImageProvider } from '../providers/image/image';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { HttpModule } from '@angular/http';
import { UserProvider } from '../providers/user/user';
import { PostProvider } from '../providers/post/post';
import { HideHeaderDirective } from '../directives/hide-header/hide-header';
import { SettingsPage } from '../pages/settings/settings';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { FriendsPage } from '../pages/friends/friends';
import { TabsfriendsPage } from '../pages/tabsfriends/tabsfriends';
import { BuddiesPage } from '../pages/buddies/buddies';
import { RequestsProvider } from '../providers/requests/requests';
import { ChatProvider } from '../providers/chat/chat';
import { BuddychatPage } from '../pages/buddychat/buddychat';
import { EmojiProvider } from '../providers/emoji/emoji';
import { EmojiPickerComponent } from '../components/emoji-picker/emoji-picker';
import { HistorychatPage } from '../pages/historychat/historychat';
import { GroupsPage } from '../pages/groups/groups';
import { NewgroupPage } from '../pages/newgroup/newgroup';
import { GroupsProvider } from '../providers/groups/groups';
import { GroupchatPage } from '../pages/groupchat/groupchat';
import { GroupbuddiesPage } from '../pages/groupbuddies/groupbuddies';
import { GroupmembersPage } from '../pages/groupmembers/groupmembers';
import { GroupinfoPage } from '../pages/groupinfo/groupinfo';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Geolocation } from '@ionic-native/geolocation';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { HelpPage } from '../pages/help/help';
import { CallNumber } from '@ionic-native/call-number';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { HowtoPage } from '../pages/howto/howto';
import { HelpfamilyPage } from '../pages/helpfamily/helpfamily';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { EdituserPage } from '../pages/edituser/edituser';
import { PasswordresetPage } from '../pages/passwordreset/passwordreset';
import { FamilyPage } from '../pages/family/family';
import { FamilybuddysPage } from '../pages/familybuddys/familybuddys';
import { FamilyProvider } from '../providers/family/family';
import { RegisterNamePage } from '../pages/register-name/register-name';
import { RegisterAgePage } from '../pages/register-age/register-age';
import { RegisterDiseasePage } from '../pages/register-disease/register-disease';
import { RegisterPhotoPage } from '../pages/register-photo/register-photo';
import { RegisterPhonePage } from '../pages/register-phone/register-phone';
import { RegisterProvider } from '../providers/register/register';
import { LoginProvider } from '../providers/login/login';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Autostart } from '@ionic-native/autostart';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';
import { GooglemapmodalPage } from '../pages/googlemapmodal/googlemapmodal';

firebase.initializeApp(FIREBASE_CONFIG);
firebase.firestore().settings({ timestampsInSnapshots: true })

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
    TabsCameraPage,
    SettingsPage,
    HideHeaderDirective,
    FriendsPage,
    TabsfriendsPage,
    BuddiesPage,
    BuddychatPage,
    EmojiPickerComponent,
    HistorychatPage,
    GroupsPage,
    NewgroupPage,
    GroupchatPage,
    // detail groupchat
    GroupbuddiesPage,
    GroupmembersPage,
    GroupinfoPage,
    HelpPage,
    HowtoPage,
    HelpfamilyPage,
    EdituserPage,
    PasswordresetPage,
    FamilyPage,
    FamilybuddysPage,
    //REGISTER DETAILS
    RegisterNamePage,
    RegisterAgePage,
    RegisterDiseasePage,
    RegisterPhonePage,
    RegisterPhotoPage,
    GooglemapmodalPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      // scrollAssist: true,
      // autoFocusAssist: true 
      tabsHideOnSubPages: true,
    }),
    BrowserAnimationsModule,
    IonicImageViewerModule,
    IonicStorageModule.forRoot()

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
    SettingsPage,
    TabsCameraPage,
    FriendsPage,
    TabsfriendsPage,
    BuddiesPage,
    BuddychatPage,
    EmojiPickerComponent,
    HistorychatPage,
    GroupsPage,
    NewgroupPage,
    GroupchatPage,
    //REGISTER DETAILS
    RegisterNamePage,
    RegisterAgePage,
    RegisterDiseasePage,
    RegisterPhotoPage,
    RegisterPhonePage,
    // detail groupchat
    GroupbuddiesPage,
    GroupmembersPage,
    GroupinfoPage,
    HelpPage,
    HowtoPage,
    HelpfamilyPage,
    EdituserPage,
    PasswordresetPage,
    FamilyPage,
    FamilybuddysPage,
    GooglemapmodalPage

  ],
  providers: [
    StatusBar,
    Firebase,
    SplashScreen,
    GoogleMaps,
    TextToSpeech,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    CollectionServicesProvider,
    ImageProvider,
    PreloaderProvider,
    UserProvider,
    PostProvider,
    SpeechRecognition,
    RequestsProvider,
    ChatProvider,
    EmojiProvider,
    GroupsProvider,
    Geolocation,
    PhotoViewer,
    CallNumber,
    AndroidPermissions,
    FamilyProvider,
    RegisterProvider,
    LoginProvider,
    LocalNotifications,
    BackgroundMode,
    Autostart,
    SocialSharing,
    Network,
    NetworkProvider
    
  ]
})
export class AppModule { }
