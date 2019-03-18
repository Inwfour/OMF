import { Injectable, group } from '@angular/core';
import firebase from 'firebase';
import { Events, AlertController } from 'ionic-angular';
import { UserProvider } from '../user/user';
@Injectable()
export class GroupsProvider {
  firegroup = firebase.firestore().collection("groups");
  mygroups: Array<any> = [];
  mygroupsfriend: Array<any> = [];
  mygroupsowner: Array<any> = [];
  groupinfoowner = [];
  groupinfofriend = [];
  currentgroup: Array<any> = [];
  currentgroupname;
  grouppic;
  groupmsgs;
  url: string = "assets/imgs/user.png";

  constructor(public events: Events,
    public _USER: UserProvider,
    public alertCtrl: AlertController
  ) {

  }

  addgroup(newGroup) {
    return new Promise((resolve, reject) => {
      // check name group
      var check = [];
      var checkgroup = [];
      this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").get().then((snapshot) => {
        check = snapshot.docs;
        for (var i in check) {
          if (newGroup.groupName === check[i].id)
            checkgroup.push(check[i].id);
        }
        if (checkgroup.length == 0) {
          if (newGroup.groupPic != "assets/imgs/user.png") {
            this._USER.uploadImgGroup(newGroup).then((data) => {
              newGroup.groupPic = data;
            });
          }
          this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(newGroup.groupName)
            .set({
              groupimage: newGroup.groupPic,
              msgboard: '',
              owner: firebase.auth().currentUser.uid
            }).then(() => {
              resolve(true)
            }).catch((err) => {
              reject(err);
            })
        } else {
          let alert = this.alertCtrl.create({
            title: "ชื่อซ้ำ",
            buttons: [
              {
                text: "ตกลง"
              }
            ]
          })
          alert.present();
        }
      })
    })
  }

  getmygroups() {
    this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups")
      .get().then((snapshot) => {
        this.mygroups = [];
        this.mygroupsfriend = [];
        this.mygroupsowner = [];
        if (snapshot.docs != null) {
          var temp = snapshot.docs;
          for (var key in temp) {
            let newgroup = {
              groupName: temp[key].id,
              groupimage: temp[key].data().groupimage
            }
            this.mygroups.push(newgroup);
            if (firebase.auth().currentUser.uid === temp[key].data().owner) {
              let newgroup = {
                groupName: temp[key].id,
                groupimage: temp[key].data().groupimage
              }
              this.mygroupsowner.push(newgroup);
            } else {
              let newgroup = {
                groupName: temp[key].id,
                groupimage: temp[key].data().groupimage
              }
              this.mygroupsfriend.push(newgroup);
            }
          }
        }
        this.events.publish('newgroup');
      })
  }

  getintogroup(groupname) {
    if (groupname != null) {
      this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(groupname).collection('members')
        .get()
        .then((snapshot) => {
          if (snapshot.docs != null) {
            var temp = snapshot.docs
            this.currentgroup = [];
            for (var key in temp) {
              this.currentgroup.push(temp[key]);
            }
            this.currentgroupname = groupname
            this.events.publish('gotintogroup')
          }
        })
    }
  }

  getownership(groupname) {
    return new Promise((resolve, reject) => {
      this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(groupname)
      
        .get()
        .then((snapshot) => {
          var temp = snapshot.data().owner;
          if (temp == firebase.auth().currentUser.uid) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        }).catch(err => {
          reject(err);
        })
    })
  }

  getgroupimage() {
    return new Promise((resolve, reject) => {
      this.firegroup.doc(firebase.auth().currentUser.uid)
        .collection("newgroups").doc(this.currentgroupname)
        .get()
        .then((snapshot) => {
          this.grouppic = snapshot.data().groupimage;
          resolve(true);
        })
    })
  }

  addmember(newmember) {
    console.log(newmember);
    this.firegroup.doc(firebase.auth().currentUser.uid)
      .collection("newgroups").doc(this.currentgroupname)
      .collection("members")
      .add(newmember.data()).then(() => {
        this.getgroupimage().then(() => {
          this.firegroup.doc(newmember.id)
            .collection("newgroups").doc(this.currentgroupname)
            .set({
              groupimage: this.grouppic,
              owner: firebase.auth().currentUser.uid,
              msgboard: ''
            }).then(() => {
              alert("เพิ่มสำเร็จแล้ว");
            }).catch((err) => {
              console.log(err);
            })
        })
        this.getintogroup(this.currentgroupname);
      })

  }

  deletemember(member) {
    this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
      .collection("members").doc(member.id).delete().then(() => {
        this.firegroup.doc(member.data().owner).collection("newgroups").doc(this.currentgroupname).delete().then(() => {
          console.log("delete success");
          this.getintogroup(this.currentgroupname);
        })
      })
  }

  getinfogroup() {
    this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
      .get().then((snapshot) => {
        this.groupinfoowner = [];
        var owner = snapshot.data().owner
        this._USER.getalluser().then((data) => {
          for (var i in data) {
            if (owner === data[i].id) {
              this.groupinfoowner.push(data[i]);
            }
          }
        })
        this.events.publish('getinfogroup');
      })
  }

  getinfogroupfriend() {
    this.groupinfofriend = [];
    this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
      .get().then((snapshot) => {
        let owner = snapshot.data().owner
        this.firegroup.doc(owner).collection("newgroups").doc(this.currentgroupname)
          .collection("members").get().then((res) => {
            this.groupinfofriend = res.docs;
            this.events.publish('getinfogroupfriend');
          })
      })
  }


  leavegroup() {
    return new Promise((resolve, reject) => {
      // search fine owner
      this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
        .get().then((data) => {
          var tempowner = data.data().owner;

          // search find id in members of owner
          this.firegroup.doc(tempowner).collection("newgroups").doc(this.currentgroupname).collection("members")
            .where("owner", "==", firebase.auth().currentUser.uid).get().then((snapshot) => {
              var leaveowner
              snapshot.forEach((docs) => {
                leaveowner = docs.id;
              })

              // delete id in members of owner
              this.firegroup.doc(tempowner).collection("newgroups").doc(this.currentgroupname).collection("members")
                .doc(leaveowner).delete().then(() => {

                  // delete id in me
                  this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
                    .delete().then(() => {
                      console.log("leave success");
                      resolve(true);
                    }).catch((err) => {
                      reject(err);
                    })
                })
            }).catch((err) => {
              reject(err)
            })
        }).catch(err => {
          reject(err);
        })
    })
  }

  deletegroup() {
    return new Promise((resolve, reject) => {
      this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
        .get().then((snapshot) => {
          if (snapshot.data().groupimage != "assets/imgs/user.png") {
            this._USER.deleteImgGroup(this.currentgroupname);
          } else {
            console.log("ผ่าน");
          }
        })
      this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
        .collection("members").get().then((snapshot) => {
          var tempmembers = snapshot.docs
          for (var key in tempmembers) {
            console.log(tempmembers[key].data().owner);
            this.firegroup.doc(tempmembers[key].data().owner).collection("newgroups").doc(this.currentgroupname)
            .collection("msgboard").get().then((snapshot) => {
              var tempmsg = snapshot.docs
              for (var i in tempmsg) {
                this.firegroup.doc(tempmembers[key].data().owner).collection("newgroups").doc(this.currentgroupname)
                .collection("msgboard").doc(tempmsg[i].id).delete();
              }
              this.firegroup.doc(tempmembers[key].data().owner).collection("newgroups").doc(this.currentgroupname)
              .delete();
            })

            this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
              .collection("members").doc(tempmembers[key].id).delete();
          }
          
          // delete msgowner before delete doc
          this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
              .collection("msgboard").get().then((snapshot) => {
                let msgowner = snapshot.docs;
                for(var i in msgowner) {
                  this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
              .collection("msgboard").doc(msgowner[i].id).delete();
                }
                this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
                .delete().then(() => {
                  resolve(true);
                }).catch(err => {
                  reject(err);
                })
              })
        })
    })
  }

  addgroupmsg(newmessage) {
    return new Promise((resolve, reject) => {
      this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
        .get().then((res) => {
          var temowner = res.data().owner
          this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(this.currentgroupname)
            .collection("msgboard").add({
              sentby: firebase.auth().currentUser.uid,
              displayName: firebase.auth().currentUser.displayName,
              photoURL: firebase.auth().currentUser.photoURL,
              message: newmessage,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
              if (temowner != firebase.auth().currentUser.uid) {
                this.firegroup.doc(temowner).collection("newgroups").doc(this.currentgroupname)
                  .collection("msgboard").add({
                    sentby: firebase.auth().currentUser.uid,
                    displayName: firebase.auth().currentUser.displayName,
                    photoURL: firebase.auth().currentUser.photoURL,
                    message: newmessage,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  })
              }
              var tempmembers = [];
              this.firegroup.doc(temowner).collection("newgroups").doc(this.currentgroupname).collection("members")
                .get().then((snapshot) => {
                  var temmembersobj = snapshot.docs
                  for (var key in temmembersobj) {
                    tempmembers.push(temmembersobj[key].data().owner)
                  }
                }).then(() => {
                  let postedmsgs = tempmembers.map((item) => {
                    console.log("item ", item);
                    if (item != firebase.auth().currentUser.uid) {
                      return new Promise((resolve) => {
                        this.postmsgs(item, newmessage, resolve);
                      })
                    }
                  })
                  Promise.all(postedmsgs).then(() => {
                    resolve(true);
                  })
                })
            })
        })
    })
  }

  postmsgs(member, msg, cb) {
    this.firegroup.doc(member).collection("newgroups").doc(this.currentgroupname).collection("msgboard")
      .add({
        sentby: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName,
        photoURL: firebase.auth().currentUser.photoURL,
        message: msg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        cb();
      })
  }

  getgroupmsgs(groupname) {
    this.firegroup.doc(firebase.auth().currentUser.uid).collection("newgroups").doc(groupname)
      .collection("msgboard").orderBy("timestamp").get().then((snapshot) => {
        this.groupmsgs = [];
        this.groupmsgs= snapshot.docs;
        // for (var key in tempmsgholder) {
        //   this.groupmsgs.push(tempmsgholder[key]);
        // }
        this.events.publish("newgroupmsg");
      })
  }



}
