import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController, AlertController,
ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import firebase, { database } from 'firebase';
import moment from 'moment';
import { CommentsPage } from '../comments/comments';
import { Firebase  } from '@ionic-native/firebase';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string = "";
  _uid:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController
    , private toastCtrl: ToastController, private camera: Camera,private http:HttpClient,private actionSheetCtrl:ActionSheetController
    , private alertCtrl:AlertController,private modalCtrl:ModalController,private firebaseCordova:Firebase) {
    this.text = "";
    this.getPosts();

    this._uid = firebase.auth().currentUser.uid;

    this.firebaseCordova.getToken().then((token) => {
      console.log(token);
      this.updateToken(token,firebase.auth().currentUser.uid);
    }).catch((err) => {
      console.log(err);
    })

  }

  updateToken(token: string,uid: string){

    firebase.firestore().collection("users").doc(uid).set({
      token: token,
      tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, {
        merge: true
    }).then((data) => {

    }).catch((err) => {
      console.log(err);
    })

  }

  addPhoto() {
    this.lunchCamera();
  }

  lunchCamera() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
    }

    this.camera.getPicture(options).then((base64Image) => {
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) => {
      console.log(err);
    })
  }

  getPosts() {

    this.posts = [];

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`

    });

    loader.present();

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
          for(let i = 0;i < this.posts.length; i++){
            if(this.posts[i].id == change.doc.id){
              this.posts[i] = change.doc;
            }
          }
        }
        if(change.type == "removed"){
          // TODO
        }
      })
    })

    query.get().then((docs) => {

      docs.forEach((doc) => {
        this.posts.push(doc);
      })

      loader.dismiss();

      this.cursor = this.posts[this.posts.length - 1];
      console.log(this.posts);

    }).catch((err) => {
      console.log(err);
    })
  }

  loadMorePosts(event) {
    firebase.firestore().collection("posts").orderBy("created", "desc").startAfter(this.cursor)
      .limit(this.pageSize).get().then((docs) => {

        docs.forEach((doc) => {
          this.posts.push(doc);
        })
        console.log(this.posts);

        if (docs.size < this.pageSize) {
          // all documents have been loaded
          event.enable(false);
          this.infiniteEvent = event;
        } else {
          event.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }

      }).catch((err) => {
        console.log(err);
      })
  }

  post() {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
      
    });
  
    loader.present();
    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName,
      likes: {
        [`${firebase.auth().currentUser.uid}`] : false
      },
      likesCount: 0
      
    }).then(async (doc) => {
      loader.dismiss();
      console.log(doc);

      if (this.image) {
        loader.dismiss();
        await this.upload(doc.id);
      }

      this.text = "";
      this.image = undefined;

      this.getPosts();
    }).catch((err) => {
      loader.dismiss();
      console.log(err);
    })

  }

  refresh(event) {
    this.posts = [];
    if (this.infiniteEvent) {
      this.infiniteEvent.enable(true);
    }
    this.getPosts();
    event.complete();
  }

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  upload(name: string) {
    return new Promise((resolve, reject) => {

      let loader = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="assets/imgs/loading.svg">`,
        
      });
      loader.present();

      let ref = firebase.storage().ref("postImages/" + name);

      let uploadTask = ref.putString(this.image.split(',')[1], "base64");

      uploadTask.on("state_changed", (taskSnapshot: any) => {
        console.log(taskSnapshot)
        let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        loader.setContent("Uploaded " + percentage + "% ...")

      }, (error) => {
        console.log(error)
      }, () => {
        console.log("The upload is complete!!!");

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          firebase.firestore().collection("posts").doc(name).update({
            image: url
          }).then(() => {
            loader.dismiss();
            resolve()
          }).catch((err) => {
            loader.dismiss();
            reject()
          })
        }).catch((err) => {
          reject()
        })
      })
    })

  }

  like(post){
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`
      
    });
  
    loader.present();

    let body = {
      postId: post.id,
      userId: firebase.auth().currentUser.uid,
      action: post.data().likes && post.data().likes[firebase.auth().currentUser.uid] == true ? "unlike" : "like"
    }


    this.http.post("https://us-central1-oldmyfriends.cloudfunctions.net/updateLikesCount", JSON.stringify(body)
    , {
      responseType: "text"
    }).subscribe((data) => {
      loader.dismiss();
      console.log(data);
    }, (error) => {
      loader.dismiss();
      console.log(error);
    })
       

  }

  comment(post) {
    this.modalCtrl.create(CommentsPage, {
      "post":post
    }).present();
    // this.actionSheetCtrl.create({
    //   buttons: [
    //     {
    //       text: "View All Comments",
    //       handler: () => {
    //         this.modalCtrl.create(CommentsPage, {
    //           "post":post
    //         }).present();
    //       }
    //     },
    //     {
    //       text: "New comment",
    //       handler: () => {
    //           this.alertCtrl.create({
    //             title: "New Comment",
    //             message: "Type your comment",
    //             inputs: [
    //               {
    //                 name: "comment",
    //                 type: "text"
    //               }
    //             ],
    //             buttons: [
    //               {
    //                 text: "Cancel"
    //               },
    //               {
    //                 text: "Post",
    //                 handler: (data) => {
    //                   if(data.comment){
    //                     firebase.firestore().collection("comments").add({
    //                       text: data.comment,
    //                       post: post.id,
    //                       owner: firebase.auth().currentUser.uid,
    //                       owner_name: firebase.auth().currentUser.displayName,
    //                       created: firebase.firestore.FieldValue.serverTimestamp()
    //                     }).then((doc) => {
    //                       this.toastCtrl.create({
    //                         message: "Comment posted successfully",
    //                         duration: 3000
    //                       }).present();
    //                     }).catch((err) => {
    //                       this.toastCtrl.create({
    //                         message: err.message,
    //                         duration: 3000
    //                       }).present();
    //                     })
    //                   }
    //                 }
    //               }
    //             ]
    //           }).present();
    //       }
    //     }
    //   ]
    // }).present();
  }

  delete(post) {
    let alert = this.alertCtrl.create({
      title: "Your want delete post ???",
      message: "Uid = " + post.id,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: "Confirm",
          handler: () => {
            firebase.firestore().collection("posts").doc(post.id).delete().then(() => {
              console.log("Success Uid = " + post.id);
              this.getPosts();
            }).catch((error) => {
              console.error("Error removing document: ", error);
              this.getPosts();
            });
          }
        }
      ]
    });
    alert.present();
  }

}
