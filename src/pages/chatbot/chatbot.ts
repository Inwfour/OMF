import { Component, NgZone, ViewChild, ChangeDetectorRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

declare var window;

@IonicPage()

@Component({
  selector: 'page-chatbot',
  templateUrl: 'chatbot.html',
})

export class ChatbotPage {

  messages: any[] = [];
  text: string = "";
  textVoice: any;
  matches: String[];
  isRecording = false

  @ViewChild(Content) content:Content;

  constructor(private tts: TextToSpeech, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public ngZone: NgZone,
    public speechRecognition: SpeechRecognition,
    public cd: ChangeDetectorRef
    ) {
      
    // this.messages.push({
    //   text: "ต้องการความรู้อะไรกับปู่ไหม ???",
    //   sender: "api"
    // })
  }

  startListening() {
    let options = {
      language: 'th-IN'
    }
    this.speechRecognition.startListening(options).subscribe((matches) => {
      this.matches = matches;
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

  sendVoice(match) {
    this.text = match;
  }

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
        this.messages.push({
          text: response.result.fulfillment.speech,
          sender: "api"
        });
        this.content.scrollToBottom(200);
      })
      // voice
      this.tts.speak({
        text: response.result.fulfillment.speech,
        locale: "th-IN",
        rate: 1
      })
    }, (error) => {
      alert(JSON.stringify(error))
    })

  }

  // sendVoice(){
  //   window["ApiAIPlugin"].requestVoice({
  //   },
    
  //     (response) => {
  //       this.tts.speak({
  //         text: response.result.fulfillment.speech,
  //         locale: "th-IN",
  //         rate: 1
  //       })
  //       console.log(this.text);
  //       console.log(response.result.fulfillment.speech);
  //     }, (error) => {
  //       alert(error);
  //     });
  // }


}
