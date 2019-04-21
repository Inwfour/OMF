import { Component, NgZone, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController } from 'ionic-angular';
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

  messages: any[] = [];
  text: string = "";
  isRecording = false
  getUser: any = {};
  disease: any = [];
  temprr: any = [];
  textres: any = {};

  @ViewChild(Content) content: Content;

  constructor(private tts: TextToSpeech,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ngZone: NgZone,
    public speechRecognition: SpeechRecognition,
    public cd: ChangeDetectorRef,
    public _USER: UserProvider,
    public loadingCtrl: LoadingController
  ) {
    this.messages.push({
      text: "สวัสดี " + firebase.auth().currentUser.displayName + " มีอะไรให้ช่วยไหม ???",
      sender: "api"
    })
  }

  getSearch() {
    this._USER.searchDisease().then((res: any) => {
      this.disease = res;
      this.temprr = res;
      console.log(this.disease);
    })
  }

  ionViewWillEnter() {
    this.getInformationUser();
    this.getSearch();
    this.addCountStart();
  }

  addCountStart() {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
      
    });
    loader.present();

    firebase.firestore().collection("searchdisease").get().then(snapshot => {
      snapshot.forEach(doc => {
        firebase.firestore().collection("searchdisease").where("search", "==", doc.data().search).get().then(snapshot => {
          snapshot.forEach((doc) => {
            if (doc.data()[firebase.auth().currentUser.uid] === undefined) {
              firebase.firestore().collection("searchdisease").doc(doc.id).update({
                [`${firebase.auth().currentUser.uid}`]: 0
              }).then(() => {
                loader.dismiss();
                this.getSearch();
              })
            }else {
              loader.dismiss();
              this.getSearch();
            }
          })
        })
      })

    })
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

  showvoice(text) {
        this.tts.speak({
        text: text,
        locale: "th-TH",
        rate: 1
      })
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

    // sort text search
    for (var i in this.disease) {
      if (messages === this.disease[i].data().search) {
        check.push(this.disease[i].data().search);
      }
    }
    console.log("check = ", check);
    if (check.length != 0) {
      firebase.firestore().collection("searchdisease").where("search", "==", check[0]).get().then(snapshot => {
        snapshot.forEach((doc) => {
          firebase.firestore().collection("searchdisease").doc(doc.id).update({
            [`${firebase.auth().currentUser.uid}`]: doc.data()[firebase.auth().currentUser.uid] + 1
          }).then(() => {
            this.getSearch();
          }).catch(err => {
            console.log(err);
          })
        })
      })
    }

    this.content.scrollToBottom(200);
    this.text = "";

    window["ApiAIPlugin"].requestText({
      query: messages
    }, (response) => {
      this.ngZone.run(() => {

        if(response.result.fulfillment.speech){
          try {
            console.log(response);
            this.textres = JSON.parse(response.result.fulfillment.speech);
            this.messages.push({
              text: this.textres.text,
              img: this.textres.img,
              button: this.textres.button,
              list: this.textres.list,
              sender: "api"
            })
          } catch(e) {
            this.messages.push({
              text: response.result.fulfillment.speech,
              sender: "api"
            })
          }
          this.content.scrollToBottom();
        }  
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
    console.log(q, this.disease.length);
  }

  sendAutofill(textAutofill) {
    this.text = textAutofill
    this.sendText();
    this.text = "";
  }

}
