import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as corsLib from 'cors';

admin.initializeApp(functions.config().firebase);
const cors = corsLib({origin: true});
// Push Notification Firebase functions
const sendNotification = (owner_uid, type) => {

    return new Promise((resolve, reject) => {
        return admin.firestore().collection("users").doc(owner_uid).get().then((doc) => {
            if(doc.exists && doc.data().token){
                
                if(type === "new_comment"){
                    admin.messaging().sendToDevice(doc.data().token, {
                        data: {
                            title: "A new comment has been made on your post.",
                            sound: "default",
                            body: "Tap to Check"
                        }
                    }).then((sent) => {
                        resolve(sent)
                    }).catch((err) => {
                        reject(err)
                    })
                } else if(type === "new_like"){
                    admin.messaging().sendToDevice(doc.data().token, {
                        data: {
                            title: "Someone liked your post on Feedly.",
                            sound: "default",
                            body: "Tap to Check"
                        }
                    }).then((sent) => {
                        resolve(sent)
                    }).catch((err) => {
                        reject(err)
                    });
                }
    
            }
        })
    })
}


export const updateLikesCount = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    cors(request, response, () => {

    const postId = request.body.postId;
    const userId = request.body.userId;
    const action = request.body.action; // 'like' or 'unlike'

    admin.firestore().collection("posts").doc(postId).get().then((data) => {
        
        let likesCount = data.data().likesCount || 0;
        let likes = data.data().likes || [];

        let updateData = {};

        if(action == "like"){
            updateData["likesCount"] = ++likesCount;
            updateData[`likes.${userId}`] = true;
        } else {
            updateData["likesCount"] = --likesCount;
            updateData[`likes.${userId}`] = false;
        }

        admin.firestore().collection("posts").doc(postId).update(updateData).then(async () => {
            
        if(action == "like"){
            await sendNotification(data.data().owner, "new_like");
        }
            response.status(200).send("Done")
        }).catch((err) => {
            response.status(err.code).send(err.message)
        })

    }).catch((err) => {
        response.status(err.code).send(err.message)
    })

});
});

export const updateCommentsCount = functions.firestore.document('comments/{commentId}').onCreate(async (event) => {
    let data = event.data();

    let postId = data.post;

    let doc = await admin.firestore().collection("posts").doc(postId).get();

    if(doc.exists){
        let commentsCount = doc.data().commentsCount || 0;
        commentsCount++;

        await admin.firestore().collection("posts").doc(postId).update({
            "commentsCount": commentsCount
        })

        return sendNotification(doc.data().owner, "new_comment");
    } else {
        return false;
    }
})

export const deleteCommentsCount = functions.firestore.document('comments/{commentId}').onDelete(async (event) => {
    let data = event.data();

    let postId = data.post;

    let doc = await admin.firestore().collection("posts").doc(postId).get();

    if(doc.exists){
        let commentsCount = doc.data().commentsCount;
        commentsCount--;

        await admin.firestore().collection("posts").doc(postId).update({
            "commentsCount": commentsCount
        })

        return true;
    } else {
        return false;
    }
})

export const editProfile = functions.firestore.document('informationUser/{informationUser}').onUpdate((change,context) => {
    let data = change.after.data();
    let uid = data.owner;
    let img = data.photoURL;

    console.log("1",uid);
    console.log("2",img);

    // admin.firestore().collection("posts").where("owner", "==", uid)
    // .get()
    // .then(data => {
    //     data.forEach((docs) => {
    //         admin.firestore().collection("posts").doc(docs.id).update({
    //             photoUser: img
    //         })
            
    //     })
    //     return true;
    // }).catch(() => {
    //     return false;
    // })
    })
