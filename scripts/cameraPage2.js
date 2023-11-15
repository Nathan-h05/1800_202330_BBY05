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



function chooseFileListener(){
    const fileInput = document.getElementById("mypic-input");   // pointer #1
    const image = document.getElementById("mypic-goes-here");   // pointer #2

    //attach listener to input file
    //when this file changes, do something
    fileInput.addEventListener('change', function(e){

        //the change event returns a file "e.target.files[0]"
        ImageFile = e.target.files[0];
        var blob = URL.createObjectURL(ImageFile);

        //change the DOM img element source to point to this file
        image.src = blob;    //assign the "src" property of the "img" tag
    }
  )}


chooseFileListener();

  function savePost() {

    var storageRef = firebase.storage().ref(ImageFile.name);

    storageRef.put(ImageFile) 
    console.log("Save post is triggered");
    let postTitle = document.getElementById("title").value;
    let tags = document.getElementById("level").value;
    let postDescription = document.getElementById("description").value;
    alert ("SAVE POST is triggered");
    var user = firebase.auth().currentUser;

    if (user) {
        var storageRef = firebase.storage().ref(ImageFile.name);

        // Asynch call to put File Object (global variable ImageFile) onto Cloud
        storageRef.put(ImageFile, { contentType: ImageFile.type })
            .then(function () {
                console.log('Uploaded to Cloud Storage.');

                // Asynch call to get URL from Cloud
                storageRef.getDownloadURL().then(function (url) {
                    console.log("Got the download URL.");

                    // Get the document for the current user.
                        db.collection("posts").add({
                            userID: user.uid,
                            name: postTitle,
                            details: postDescription,
                            importance: tags,
                            last_updated: firebase.firestore.FieldValue
                                .serverTimestamp(), //current system time
                            code: url,
                            lat: latitude,
                            lng: longitude,
                    }).then(() => {
                        window.location.href = "#"; // Redirect to the thanks page
                    }).catch((error) => {
                        console.error("Error adding document: ", error);
                    });
                }).catch(function (error) {
                    console.error("Error getting download URL: ", error);
                });
            }).catch(function (error) {
                console.error("Error uploading to Cloud Storage: ", error);
            });
    } else {
        console.log("No user is signed in");
        window.location.href = 'login.html';
    }
}