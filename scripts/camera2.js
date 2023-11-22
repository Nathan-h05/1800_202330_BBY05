var ImageFile;      //global variable to store the File Object reference


// Geo Location
let latitude;
let longitude;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updateLocation);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function updateLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    // You can use latitude and longitude variables as needed, e.g., send to a server, perform calculations, etc.
    console.log("Latitude: " + latitude + ", Longitude: " + longitude);
}
// Call getLocation() when you want to get the current location
getLocation()



var postDocID = localStorage.getItem("postDocID");    //visible to all functions on this page


var ImageFile;
function listenFileSelect() {
    // listen for file selection
    var fileInput = document.getElementById("mypic-input"); // pointer #1
    const image = document.getElementById("mypic-goes-here"); // pointer #2

    // When a change happens to the File Chooser Input
    fileInput.addEventListener('change', function (e) {
        ImageFile = e.target.files[0];   //Global variable
        var blob = URL.createObjectURL(ImageFile);
        image.src = blob; // Display this image
    })
}
listenFileSelect();

function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)   //global variable ImageFile

        // AFTER .put() is done
        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                // AFTER .getDownloadURL is done
                .then(function (url) { // Get URL of the uploaded file
                    console.log("3. Got the download URL.");

                    // Now that the image is on Storage, we can go back to the
                    // post document, and update it with an "image" field
                    // that contains the url of where the picture is stored.
                    db.collection("posts").doc(postDocID).update({
                        "code": url // Save the URL into users collection
                    })
                        // AFTER .update is done
                        .then(function () {
                            console.log('4. Added pic URL to Firestore.');
                            // One last thing to do:
                            // save this postID into an array for the OWNER
                            // so we can show "my posts" in the future
                            savePostIDforUser(postDocID);
                        })
                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}

function savePost() {
    console.log("Save post is triggered");
    let postTitle = document.getElementById("title").value;
    let tags = document.getElementById("level").value;
    let postDescription = document.getElementById("description").value;
    // alert("SAVE POST is triggered");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            var desc = document.getElementById("description").value;
            db.collection("posts").add({
                userID: user.uid,
                name: postTitle,
                details: postDescription,
                importance: tags,
                last_updated: firebase.firestore.FieldValue
                    .serverTimestamp(), //current system time
                lat: latitude,
                lng: longitude,
                
            }).then(doc => {
                console.log("1. Post document added!");
                console.log(doc.id);
                uploadPic(doc.id);
                
            })
        } else {
            // No user is signed in.
            console.log("Error, no user signed in");
        }
    });

    console.log(postTitle, tags, postDescription);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;


    }
}

// Only click submit button once / run the functon savePost() once 
let postReady = true;
document.getElementById("submit").addEventListener("click", function() {
    if (postReady) {
        savePost();
    }
    postReady = false;
});


//--------------------------------------------
//saves the post ID for the user, in an array
//--------------------------------------------
function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {
        console.log("user id is: " + user.uid);
        console.log("postdoc id is: " + postDocID);
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
        })
            .then(() => {
                console.log("5. Saved to user's document!");
                // alert("Post is complete!");
                window.location.href = "thanks.html";
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    })
}




// function savePost() {

//   var storageRef = firebase.storage().ref(ImageFile.name);

//   storageRef.put(ImageFile)
//   console.log("Save post is triggered");
//   let postTitle = document.getElementById("title").value;
//   let tags = document.getElementById("level").value;
//   let postDescription = document.getElementById("description").value;
//   // alert("SAVE POST is triggered");
//   var user = firebase.auth().currentUser;

//   if (user) {
//     var storageRef = firebase.storage().ref(ImageFile.name);

//     // Asynch call to put File Object (global variable ImageFile) onto Cloud
//     storageRef.put(ImageFile, { contentType: ImageFile.type })
//       .then(function () {
//         console.log('Uploaded to Cloud Storage.');

//         // Asynch call to get URL from Cloud
//         storageRef.getDownloadURL().then(function (url) {
//           console.log("Got the download URL.");

//           // Get the document for the current user.
//           db.collection("posts").add({
//             userID: user.uid,
//             name: postTitle,
//             details: postDescription,
//             importance: tags,
//             last_updated: firebase.firestore.FieldValue
//               .serverTimestamp(), //current system time
//             code: url,
//             lat: latitude,
//             lng: longitude,
//           }).then(() => {
//             console.log("1. Post document added!");
//             console.log(doc.id);
//             uploadPic(doc.id);
//           }).catch((error) => {
//             console.error("Error adding document: ", error);
//           });
//         }).catch(function (error) {
//           console.error("Error getting download URL: ", error);
//         });
//       }).catch(function (error) {
//         console.error("Error uploading to Cloud Storage: ", error);
//       });
//   } else {
//     console.log("No user is signed in");
//     window.location.href = 'login.html';
//   }
// }

