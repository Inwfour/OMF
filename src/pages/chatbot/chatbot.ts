import { Component, NgZone, ViewChild, ChangeDetectorRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';

declare var window;

@IonicPage()

@Component({
  selector: 'page-chatbot',
  templateUrl: 'chatbot.html',
})

export class ChatbotPage {

  buttons:any = [];
  lists:any = [];
  messages: any[] = [];
  text: string = "";
  textVoice: any;
  matches: String[];
  isRecording = false
  img:any = firebase.auth().currentUser.photoURL;
  photoUser:string = "";
  getUser:any = {};

  @ViewChild(Content) content:Content;

  constructor(private tts: TextToSpeech, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public ngZone: NgZone,
    public speechRecognition: SpeechRecognition,
    public cd: ChangeDetectorRef,
    public _USER: UserProvider
    ) {
      console.log(this.img);
    this.messages.push({
      text: "ต้องการความรู้อะไรกับปู่ไหม ???",
      sender: "api"
    })
  }

  ionViewWillEnter() {
    this.getInformationUser();
  }


  getInformationUser() {
    this._USER.getInformationUser(firebase.auth().currentUser.uid).then(data => {
      this.getUser = data;
    })
  }

  startListening() {
    let options = {
      language: 'th-TH'
    }
    this.speechRecognition.startListening(options).subscribe((matches) => {
      this.text = matches[0];
      this.sendText();
      this.getPermissions();
      this.stopListening();
    }),
    this.isRecording = true
  }

  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }

  getPermissions() {
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      if (!hasPermission) {
        this.speechRecognition.requestPermission();
      }
    });
  }

  // sendVoice(match) {
  //   this.text = match;
  //   this.sendText();
  //   this.matches = String[""];
  // }

  sendText() {

    let messages = this.text;

    this.messages.push({
      text: messages,
      sender: "me"
    })
    this.content.scrollToBottom(200);
    this.text = "";

    window["ApiAIPlugin"].requestText({
      query: messages
    }, (response) => {

      this.ngZone.run(() => {
        console.log(response);
        if(response.result.fulfillment.speech != ""){
        this.messages.push({
          text: response.result.fulfillment.speech,
          sender: "api"
        });
        }else {
        firebase.firestore().collection("disease").doc(response.result.parameters.disease)
        .collection("รายละเอียด").doc(response.result.parameters.desease_detail).get().then((res) => {
          this.messages.push({
            text: res.data().text,
            button: res.data().button,
            list: res.data().list,
            sender: "api"
          });
          // this.buttons = res.data().button;
          // this.lists = res.data().list;
          console.log(this.messages);
        })
        }
        
        this.content.scrollToBottom(200);
        
      })
      // voice
      this.tts.speak({
        text: response.result.fulfillment.speech,
        locale: "th-TH",
        rate: 1
      })
    }, (error) => {
      alert(JSON.stringify(error))
    })

  }


}
