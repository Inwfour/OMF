import { Component, NgZone, ViewChild, ElementRef, Directive, HostListener } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';

declare var window;

@IonicPage()

@Component({
  selector: 'page-chatbot',
  templateUrl: 'chatbot.html',
})
@Directive({
  selector: 'ion-textarea[autosize]' // Attribute selector,
})
export class ChatbotPage {

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.resize()
  }

  messages: any[] = [];
  text: string = "";
  @ViewChild(Content) content:Content;

  constructor(private tts: TextToSpeech, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public ngZone: NgZone,
    private element:ElementRef
    ) {
      
    this.messages.push({
      text: "ต้องการความรู้อะไรกับปู่ไหม ???ddddddddddddddddddddddddddddddd",
      sender: "api"
    })
  }

  ngAfterViewInit() {
    this.resize()
  }

  resize() {
    let textArea =
      this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = (textArea.scrollHeight + 16) + "px";
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
