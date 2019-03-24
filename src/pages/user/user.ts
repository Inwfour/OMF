import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ActionSheetController } from 'ionic-angular';
import firebase from 'firebase';
import moment from 'moment';
import { CommentsPage } from '../comments/comments';
import { HttpClient } from '@angular/common/http';
import { EditPostPage } from '../edit-post/edit-post';
import { ImageProvider } from '../../providers/image/image';
import { UserProvider } from '../../providers/user/user';
import { EdituserPage } from '../edituser/edituser';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  text: string = "";
  posts: any[] = [];
  getUser:any = {};
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string = "";
  _uid: any;
  DisplayName: string;
  comments: any;
  textEdit: any;
  checkEdit: boolean;
  photoURLDisplay: string = "";
  postLength: any;
  friendsLength: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public _IMG:ImageProvider,
    public _USER: UserProvider
  ) {
    
    this._uid = firebase.auth().currentUser.uid;
    this.photoURLDisplay = firebase.auth().currentUser.photoURL;
    console.log(this.photoURLDisplay)
  }

  ionViewWillEnter() {
    this.getInformationUser();
    this.getPosts();
  }


  getInformationUser() {
    this._USER.getInformationUser(this._uid).then(data => {
      this.getUser = data;
    })
  }

  getPosts() {

    this.posts = [];

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`

    }); loader.present();
    
    //Post length
    let postUser = firebase.firestore().collection("posts")
      .where("owner", "==", this._uid);

    postUser.get().then((data) => {
      this.postLength = data.docs.length;
    })

    //Friends length
    firebase.firestore().collection("friends").doc(firebase.auth().currentUser.uid)
    .collection("friend")
    .get()
    .then((snapshot) => {
      this.friendsLength = snapshot.docs.length;
    })

    let query = firebase.firestore().collection("posts")
      .where("owner", "==", this._uid)
      .orderBy("created", "desc")
      .limit(this.pageSize)

      let user = firebase.firestore().collection("informationUser")
      .where("owner", "==", this._uid)

    user.onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
        }
        if (change.type == "modified") {
          for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == change.doc.id) {
              this.posts[i] = change.doc;
            }
          }

          // Edit posts 
          firebase.firestore().collection("posts").where("owner", "==", this._uid)
          .get()
          .then(data => {
              data.forEach((docs) => {
                  console.log("update post",docs.id);
                  firebase.firestore().collection("posts").doc(docs.id).update({
                      photoUser: change.doc.data().photoURL
                  })
              })
          })

          // Edit comments
          firebase.firestore().collection("comments").where("owner", "==", this._uid)
          .get()
          .then(data => {
            data.forEach((docs) => {
              console.log("update comments",docs.id);
              firebase.firestore().collection("comments").doc(docs.id).update({
                  photoUser: change.doc.data().photoURL
              })
          })
          })
          
        }
        if (change.type == "removed") {
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

  refresh(event) {
    this.posts = [];
    if (this.infiniteEvent) {
      this.infiniteEvent.enable(true);
    }
    this.getPosts();
    event.complete();
  }


  loadMorePosts(event) {
    firebase.firestore().collection("posts")
      .where("owner", "==", this._uid)
      .orderBy("created", "desc")
      .startAfter(this.cursor)
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

  ago(time) {
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  like(post) {
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
      "post": post,

    }).present();
  }

  delete(post) {

    let alert = this.actionSheetCtrl.create({
      title: "คุณต้องการที่จะลบโพสท์ ?",
      buttons: [
        {
          text: "Confirm",
          handler: () => {
            let loader = this.loadingCtrl.create({
              spinner: 'hide',
              content: `<img src="assets/imgs/loading.svg">`

            });

            loader.present();
            // Delete Posts
            firebase.firestore().collection("posts").doc(post.id).delete()
              .then(() => {
                console.log("Success Uid Posts = " + post.id);
                // Get Comments
                firebase.firestore().collection("comments").where("post", "==", post.id)
                  .get()
                  .then((data) => {
                    data.forEach(function (doc) {
                      // Delete Comments

                      firebase.firestore().collection("comments").doc(doc.id).delete()
                        .then(() => {
                          console.log("Success Uid Comments = " + doc.id);
                          loader.dismiss();
                        }).catch((err) => {
                          loader.dismiss();
                          console.log(err);
                        }) // Success Delete

                    }) // Finish Get comments
                    this.comments = data.docs.length;
                    console.log(this.comments);
                    loader.dismiss();
                    this.getPosts();

                  }).catch((err) => {

                    console.log(err);
                  })

              }).catch((error) => {
                console.error("Error removing document: ", error);
                this.getPosts();
              });
          }
        },
        {
          text: "กลับ",
          handler: () => {
            console.log("ไม่ได้ลบข้อมูล");
          }
        }
      ]
    });
    alert.present();
  }

  edit(post) {
    this.modalCtrl.create(EditPostPage, {
      "post": post
    }).present();
  }

  changeProfilePicture() {
    let alert = this.actionSheetCtrl.create({
      title: "คุณต้องการรูปในลักษณะใด ?",
      buttons: [
        {
          text: "กล้องถ่ายรูป",
          handler: () => {
            this._IMG.camera().then(img => {
              this._USER.uploadImgUser(firebase.auth().currentUser.uid,img).then((url) => {
                this._USER.updateImgUser(firebase.auth().currentUser.displayName,url).then(() => {
                  this.getInformationUser();
                })
              })
            })
          }
        },
        {
          text: "เลือกจากอัลบั้มรูปภาพ",
          handler: () => {
            this._IMG.selectImage().then(img => {
              this._USER.uploadImgUser(firebase.auth().currentUser.uid,img).then((url) => {
                this._USER.updateImgUser(firebase.auth().currentUser.displayName,url).then(() => {
                  this.getInformationUser();
                })
              })
            })
          }
        },
        {
          text: "กลับ",
          handler: () => {
            console.log("ไม่ได้ลบข้อมูล");
          }
        }
      ]
    });
    alert.present();
  }

  goEditProfile(){
    this.navCtrl.push(EdituserPage);
  }

  friend() {
    this.navCtrl.setRoot(TabsPage);
  }

}
