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
    public _USER: UserProvider
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
    firebase.firestore().collection("searchdisease").get().then(snapshot => {
      snapshot.forEach(doc => {
        firebase.firestore().collection("searchdisease").where("search", "==", doc.data().search).get().then(snapshot => {
          snapshot.forEach((doc) => {
            if (doc.data()[firebase.auth().currentUser.uid] === undefined) {
              firebase.firestore().collection("searchdisease").doc(doc.id).update({
                [`${firebase.auth().currentUser.uid}`]: 0
              }).then(() => {
                this.getSearch();
              }).catch(err => {
                console.log(err);
              })
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
            console.log(this.textres);
            console.log(this.textres.text);
            console.log(this.textres.img);
            console.log(this.textres.button);
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
          this.content.scrollToBottom(200);
        }
            


        // } else {

        //   this.messages.push({
        //     text: response.result.fulfillment.speech,
        //     sender: "api"
        //   })
        //   this.content.scrollToBottom(200);

        // }

        // if (response.result.fulfillment.speech != "") {
        //   if(firebase.firestore().collection("disease").doc(response.result.parameters.disease)
        //   .collection("รายละเอียด").doc(response.result.parameters.desease_detail).get().then(data => {
        //     if(data.data().text){
        //       this.messages.push({
        //         text: response.result.fulfillment.speech,
        //         sender: "api"
        //       });
        //     }
        //     if(data.data().img){
        //       this.messages.push({
        //         img: response.result.fulfillment.speech,
        //         sender: "api"
        //       });
        //     }
        //   })
        //   )

        //   this.content.scrollToBottom(200);
        // } else {
        //   if (response.result.parameters.disease == "เบาหวานชนิดที่1" || response.result.parameters.disease == "เบาหวานชนิดที่2" || response.result.parameters.disease == "เบาหวานชนิดที่3") {
        //     firebase.firestore().collection("disease").doc("เบาหวาน")
        //       .collection(response.result.parameters.disease).doc(response.result.parameters.desease_detail).get().then((res) => {
        //         this.messages.push({
        //           text: res.data().text,
        //           button: res.data().button,
        //           list: res.data().list,
        //           img: res.data().img,
        //           sender: "api"
        //         });
        //         this.content.scrollToBottom(200);
        //       }).catch(err => {
        //         this.messages.push({
        //           text: "ปู่ยังไม่มีข้อมูลเลย ปู่ไปหาข้อมูลก่อนนะ",
        //           sender: "api"
        //         })
        //         this.content.scrollToBottom(200);
        //       })
        //   } else {
        //     firebase.firestore().collection("disease").doc(response.result.parameters.disease)
        //       .collection("รายละเอียด").doc(response.result.parameters.desease_detail).get().then((res) => {
        //         this.messages.push({
        //           text: res.data().text,
        //           button: res.data().button,
        //           list: res.data().list,
        //           img: res.data().img,
        //           sender: "api"
        //         });
        //         this.content.scrollToBottom(200);
        //       }).catch(err => {
        //         this.messages.push({
        //           text: "ปู่ยังไม่มีข้อมูลเลย ปู่ไปหาข้อมูลก่อนนะ",
        //           sender: "api"
        //         })
        //         this.content.scrollToBottom(200);
        //       })
        //   }
        // }

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
    console.log(q, this.disease.length);
  }

  sendAutofill(textAutofill) {
    this.text = textAutofill
    this.sendText();
    this.text = "";
  }

}
