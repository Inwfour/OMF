import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';

declare var window;

@IonicPage()

@Component({
  selector: 'page-chatbot',
  templateUrl: 'chatbot.html',
})

export class ChatbotPage {

  messages: any[] = [];
  text: string = "";
  @ViewChild(Content) content:Content;

  constructor(private tts: TextToSpeech, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public ngZone: NgZone,
    ) {
      
    this.messages.push({
      text: "ต้องการความรู้อะไรกับปู่ไหม ???ddddddddddddddddddddddddddddddd",
      sender: "api"
    })
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

    }, (error) => {
      alert(JSON.stringify(error))
    })
  }

  sendVoice(){
    window["ApiAIPlugin"].requestVoice({},
      (response) => {
        this.tts.speak({
          text: response.result.fulfillment.speech,
          locale: "th-IN",
          rate: 1
        })
      }, (error) => {
        alert(error);
      });
  }


}
