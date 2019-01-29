import { Component, Directive, HostListener, ElementRef } from '@angular/core';
import {
  IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController, AlertController,
  ModalController
} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';
import moment from 'moment';
import { CommentsPage } from '../comments/comments';
import { Firebase } from '@ionic-native/firebase';
import { CollectionServicesProvider } from '../../providers/get-collections/get-collections';
import { EditPostPage } from '../edit-post/edit-post';
// Provider
import { PostProvider } from '../../providers/post/post';
import { ImageProvider } from '../../providers/image/image';
import { UserProvider } from '../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
@Directive({
  selector: 'ion-textarea[autosize]' // Attribute selector,
})
export class FeedPage {

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.resize()
  }

  text: string = "";
  posts: any[] = [];
  getPost: any = {};
  getUser:any = {};
  // commentsLength: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string = "";
  _uid: any;
  comments: any;
  textEdit: any;
  checkEdit: boolean;
  user: any[] = [];
  photoDisplay: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController
    , private http: HttpClient, private actionSheetCtrl: ActionSheetController
    , private modalCtrl: ModalController, private firebaseCordova: Firebase
    , private CollectionService: CollectionServicesProvider, private element: ElementRef
    , public _POST: PostProvider
    , public _IMG: ImageProvider
    , public _USER: UserProvider
  ) {
    // this.getComment();
    this.getPosts();

    this._uid = firebase.auth().currentUser.uid;
    this.photoDisplay = firebase.auth().currentUser.photoURL
    this.firebaseCordova.getToken().then((token) => {
      console.log(token);
      this.updateToken(token, firebase.auth().currentUser.uid);
    }).catch((err) => {
      console.log(err);
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

  updateToken(token: string, uid: string) {

    this.CollectionService.UsersCollection().doc(uid).set({
      token: token,
      tokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
    }, {
        merge: true
      }).then((data) => {

      }).catch((err) => {
        console.log(err);
      })

  }

  changePostPicture() {
    let alert = this.actionSheetCtrl.create({
      title: "คุณต้องการรูปในลักษณะใด ?",
      buttons: [
        {
          text: "กล้องถ่ายรูป",
          handler: () => {
            this._IMG.camera().then(data => {
              this.image = data;
            })
          }
        },
        {
          text: "เลือกจากอัลบั้มรูปภาพ",
          handler: () => {
            this._IMG.selectImage().then(data => {
              this.image = data;
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

  getPosts() {

    this.posts = [];

    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading.svg">`

    }); loader.present();


    let query = firebase.firestore().collection("posts").orderBy("created", "desc")
      .limit(this.pageSize)

    query.onSnapshot((snapshot) => {
      let changedDocs = snapshot.docChanges();

      changedDocs.forEach((change) => {
        if (change.type == "added") {
          // TODO
        }
        if (change.type == "modified") {
          // TODO
          for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id == change.doc.id) {
              this.posts[i] = change.doc;
            }
          }
        }
        if (change.type == "removed") {
          // TODO
        }
      })
    })

    query.get().then((docs) => {

      docs.forEach((doc) => {
        this.posts.push(doc);
        console.log(doc.data().owner);
        firebase.firestore().collection("informationUser").doc(doc.data().owner).get().then((data) => {
          this.getUser = data.data();
          console.log(this.getUser.owner_name);
        })
        
      })

      loader.dismiss();

      this.cursor = this.posts[this.posts.length - 1];
      console.log(this.posts);

    }).catch((err) => {
      console.log(err);
    })
  }

  loadMorePosts(event) {
    this.CollectionService.PostsCollection().orderBy("created", "desc").startAfter(this.cursor)
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

    this.CollectionService.PostsCollection().add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName,
      likes: {
        [`${firebase.auth().currentUser.uid}`]: false
      },
      likesCount: 0,
      photoUser: firebase.auth().currentUser.photoURL

    }).then(async (doc) => {

      console.log(doc);

      if (this.image) {
        await this._POST.uploadImgPost(doc.id, this.image);
      }

      this.text = "";
      this.image = undefined;
      loader.dismiss();
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
          text: "ยืนยัน",
          handler: () => {
            let loader = this.loadingCtrl.create({
              spinner: 'hide',
              content: `<img src="assets/imgs/loading.svg">`

            });

            loader.present();
            // Delete Posts
            this.CollectionService.PostsCollection().doc(post.id).delete()
              .then(() => {
                console.log("Success Uid Posts = " + post.id);
                // Get Comments
                this.CollectionService.CommentsCollection().where("post", "==", post.id)
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

}
