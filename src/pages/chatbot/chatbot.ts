import { Component, NgZone, ViewChild, ChangeDetectorRef } from '@angular/core';
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

  buttons: any = [];
  lists: any = [];
  messages: any[] = [];
  text: string = "";
  textVoice: any;
  matches: String[];
  isRecording = false
  img: any = firebase.auth().currentUser.photoURL;
  photoUser: string = "";
  getUser: any = {};
  disease:any = [];
  temprr:any = [];

  @ViewChild(Content) content: Content;

  constructor(private tts: TextToSpeech,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ngZone: NgZone,
    public speechRecognition: SpeechRecognition,
    public cd: ChangeDetectorRef,
    public _USER: UserProvider
  ) {
    this.messages.push({
      text: "สวัสดี " + firebase.auth().currentUser.displayName + " มีอะไรให้ช่วยไหม ???",
      sender: "api"
    })
  }

  getSearch(){
    this._USER.searchDisease().then((res: any) => {
      this.disease = res;
      this.temprr = res;
      console.log(this.disease);
    })
  }

  ionViewWillEnter() {
    this.getInformationUser();
    this.getSearch();
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

  sendButton(textB) {
    this.text = textB;
    this.sendText();
  }

  sendText() {

    let messages = this.text;
    var check = [];
    this.messages.push({
      text: messages,
      sender: "me"
    })
      for(var i in this.disease){
        if(messages === this.disease[i].data().search){
        check.push(this.disease[i].data().search);
        }
      }
      console.log("check = " , check);
      if(check.length === 0 && messages.length > 3){
    firebase.firestore().collection("searchdisease").add({
      search: messages
    }).then(() => {
      this.getSearch();
    }).catch(err => {
      console.log(err);
    })
    }

    this.content.scrollToBottom(200);
    this.text = "";

    window["ApiAIPlugin"].requestText({
      query: messages
    }, (response) => {

      this.ngZone.run(() => {
        console.log(response);
        if (response.result.fulfillment.speech != "") {
          this.messages.push({
            text: response.result.fulfillment.speech,
            sender: "api"
          });
          this.content.scrollToBottom(200);
        } else {
          if (response.result.parameters.disease == "เบาหวานชนิดที่1" || response.result.parameters.disease == "เบาหวานชนิดที่2" || response.result.parameters.disease == "เบาหวานชนิดที่3") {
            firebase.firestore().collection("disease").doc("เบาหวาน")
              .collection(response.result.parameters.disease).doc(response.result.parameters.desease_detail).get().then((res) => {
                this.messages.push({
                  text: res.data().text,
                  button: res.data().button,
                  list: res.data().list,
                  sender: "api"
                });
                this.content.scrollToBottom(200);
              }).catch(err => {
                this.messages.push({
                  text: "ปู่ยังไม่มีข้อมูลเลย ปู่ไปหาข้อมูลก่อนนะ",
                  sender: "api"
                })
                this.content.scrollToBottom(200);
              })
          } else {
            firebase.firestore().collection("disease").doc(response.result.parameters.disease)
              .collection("รายละเอียด").doc(response.result.parameters.desease_detail).get().then((res) => {
                this.messages.push({
                  text: res.data().text,
                  button: res.data().button,
                  list: res.data().list,
                  sender: "api"
                });
                this.content.scrollToBottom(200);
              }).catch(err => {
                this.messages.push({
                  text: "ปู่ยังไม่มีข้อมูลเลย ปู่ไปหาข้อมูลก่อนนะ",
                  sender: "api"
                })
                this.content.scrollToBottom(200);
              })
          }
        }

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

  searchuser(searchbar) {
    this.disease = this.temprr;
    var q = searchbar.target.value;
    if (q.trim() == '') {
      return;
    }
    this.disease = this.disease.filter((v) => {
      if (v.data().search && q) {
        if (v.data().search.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
    console.log(q, this.disease.length, this.disease);
  }

  sendAutofill(textAutofill) {
    this.text = textAutofill
    this.sendText();
    this.text = "";
  }

}
