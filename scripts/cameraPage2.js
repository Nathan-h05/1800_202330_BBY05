var postDocID = localStorage.getItem("postDocID");    //visible to all functions on this page

// function getHikeName(id) {
//     db.collection("hikes")
//       .doc(id)
//       .get()
//       .then((thisHike) => {
//         var hikeName = thisHike.data().name;
//         document.getElementById("hikeName").innerHTML = hikeName;
//           });
// }
//
//getHikeName(hikeDocID);

// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
// const stars = document.querySelectorAll('.star');

// Iterate through each star element
// stars.forEach((star, index) => {
//     // Add a click event listener to the current star
//     star.addEventListener('click', () => {
//         // Fill in clicked star and stars before it
//         for (let i = 0; i <= index; i++) {
//             // Change the text content of stars to 'star' (filled)
//             document.getElementById(`star${i + 1}`).textContent = 'star';
//         }
//     });
// });

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
                            "image": url // Save the URL into users collection
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
    alert ("SAVE POST is triggered");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            var desc = document.getElementById("description").value;
            db.collection("posts").add({
                userID: user.uid,
                details: desc,
                last_updated: firebase.firestore.FieldValue
                    .serverTimestamp(), //current system time
                importance: tags,
                name: postTitle,
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
    // // Get the star rating
	// 	// Get all the elements with the class "star" and store them in the 'stars' variable
    // const stars = document.querySelectorAll('.star');
	// 	// Initialize a variable 'hikeRating' to keep track of the rating count
    // let hikeRating = 0;
	// 	// Iterate through each element in the 'stars' NodeList using the forEach method
    // stars.forEach((star) => {
	// 			// Check if the text content of the current 'star' element is equal to the string 'star'
    //     if (star.textContent === 'star') {
	// 					// If the condition is met, increment the 'hikeRating' by 1
    //         hikeRating++;
    //     }
    // });

    console.log(postTitle, tags, postDescription);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user.
        db.collection("posts").add({
            // postsDocID: postID,
            userID: userID,
            name: postTitle,
            importance: tags,
            details: postDescription,
            last_updated: firebase.firestore.FieldValue.serverTimestamp() // YOOOOOOOOOO
        }).then(() => {
            window.location.href = "#"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'cameraPage2.html';
    }
}

// JJs added code

//------------------------------------------------
// So, a new post document has just been added
// and it contains a bunch of fields.
// We want to store the image associated with this post,
// such that the image name is the postid (guaranteed unique).
// 
// This function is called AFTER the post has been created, 
// and we know the post's document id.
//------------------------------------------------
//------------------------------------------------
// So, a new post document has just been added
// and it contains a bunch of fields.
// We want to store the image associated with this post,
// such that the image name is the postid (guaranteed unique).
// 
// This function is called AFTER the post has been created, 
// and we know the post's document id.
//------------------------------------------------

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
          .then(() =>{
                console.log("5. Saved to user's document!");
                                alert ("Post is complete!");
                //window.location.href = "showposts.html";
           })
           .catch((error) => {
                console.error("Error writing document: ", error);
           });
    })
}