import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  text:string = "";
  posts:any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent:any;
  image:string = "";


  constructor(public navCtrl: NavController, public navParams: NavParams,private loadingCtrl:LoadingController
    ,private toastCtrl:ToastController,private camera: Camera) {
    this.text = "";
    this.getPosts();
  }

  addPhoto(){
    this.lunchCamera();
  }

  lunchCamera(){
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation:true,
      targetHeight:512,
      targetWidth:512,
    }

    this.camera.getPicture(options).then((base64Image) => {
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }

  getPosts(){

    this.posts = [];

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
      
    });

    let query = firebase.firestore().collection("posts").orderBy("created", "desc")
    .limit(this.pageSize)

    query.onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if(change.type == "added"){
          // TODO
        }
        if(change.type == "modified"){
          // TODO
          console.log("Document with id" + change.doc.id + "has been modified.");
        }
        if(change.type == "removed"){
          // TODO
        }
      })
    })
    
    query.get().then((doc)=> {

      doc.forEach((doc) => {
        this.posts.push(doc);
      })

      loader.dismiss();

      this.cursor = this.posts[this.posts.length - 1];
      console.log(this.posts);    
    
    }).catch((err) => {
      console.log(err);
    })
  }

  loadMorePosts(event){
    this.posts = [];
    firebase.firestore().collection("posts").orderBy("created", "desc").startAfter(this.cursor)
    .limit(this.pageSize).get().then((doc)=> {
      doc.forEach((doc) => {
        this.posts.push(doc);
      })
      console.log(this.posts);    

      if(doc.size < this.pageSize){
        // all documents have been loaded
        event.enable(false);
        this.infiniteEvent = event;
      } else {
        event.complete();
        
      }
    
    }).catch((err) => {
      console.log(err);
    })
  }

  post(){
    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then((doc) => {
      console.log(doc);

      if(this.image){
        this.upload(doc.id);
      }

      this.text = "";
      this.getPosts();
    }).catch((err) => {
      console.log(err);
    })
  }

  refresh(event){
    this.posts = [];
    if(this.infiniteEvent){
      this.infiniteEvent.enable(true);
    }
    this.getPosts();
    event.complete();
  }

  ago(time){
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  upload(name: string){
    let ref = firebase.storage().ref("postImages/" + name);

    let uploadTask = ref.putString(this.image.split(',')[1], "base64");

    uploadTask.on("state_changed", (taskSnapshot) => {
      console.log(taskSnapshot)
    }, (error) => {
      console.log(error)
    }, () => {
      console.log("The upload is complete!!!");

      uploadTask.snapshot.ref.getDownloadURL().then((url) => {
        console.log(url);
      })
    })
  }

}
