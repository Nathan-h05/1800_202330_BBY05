
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
// displayCardsDynamically("posts");  //input param is the name of the collection
let tags;
function displayUserPosts(collection) {
    let cardTemplate = document.getElementById("postCardTemplate");

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection(collection)
                .where("userID", "==", user.uid)  // Filter by user ID
                .get()
                .then(allPosts => {
                    allPosts.forEach(doc => {
                        var title = doc.data().name;
                        var details = doc.data().details;
                        var code = doc.data().code;
                        tags = doc.data().importance;
                        var docID = doc.id;
                        //
                        let time = doc.data().last_updated;
                        let date = time.toDate();

                        let newcard = cardTemplate.content.cloneNode(true);
                        //
                        newcard.querySelector('.card-time').innerHTML = date;

                        newcard.querySelector('.card-title').innerHTML = title;
                        newcard.querySelector('.card-text').innerHTML = details;
                        newcard.querySelector('.card-tags').innerHTML = tags;
                        newcard.querySelector('.card-image').src = code;
                        newcard.querySelector('#delete-icon').onclick = () => deletePost(doc.id);
                        newcard.querySelector('#edit').href = "editPosts.html?docID=" + docID;

                        document.getElementById(collection + "-go-here").appendChild(newcard);

                        noPosts();
                    })
                })
                .catch(error => {
                    console.error("Error getting documents: ", error);
                })
        }
    });
}

displayUserPosts("posts");

// Buffer time after window loads to give time for cards to display
window.onload = setTimeout(loadTagColors, 2000);

function loadTagColors() {
    console.log("Function loadTagColors() ran");
    var elements = document.getElementsByClassName("tagColor");
    
    for (var i = 0; i < elements.length; i++) {
        var text = elements[i].innerText;

        if (text == "Low") {
            elements[i].classList.add("btn-success");
        }
        if (text == "Medium") {
            elements[i].classList.add("btn-warning");
        }
        if (text == "High") {
            elements[i].classList.add("btn-danger");
        }
        console.log("Loaded tag color");
    }
}

function noPosts() {
    // The widget is rendered.
    // Hide the loader.
    document.getElementById('noPosts').style.display = 'none';
}


function deletePost(postid) {
    var result = confirm("Want to delete permenantly?");
    if (result) {
        //Logic to delete the item
        db.collection("posts").doc(postid)
            .delete()
            .then(() => {
                console.log("1. Document deleted from Posts collection");
                deleteFromMyPosts(postid);
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
    }
}


function deleteFromMyPosts(postid) {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayRemove(postid)
        })
            .then(() => {
                console.log("2. post deleted from user doc");
                deleteFromStorage(postid);
            })
    })
}


function deleteFromStorage(postid) {
    let storageRef = firebase.storage().ref();
    // Create a reference to the file to delete
    var imageRef = storageRef.child('images/' + postid + '.jpg');

    // Delete the file
    imageRef.delete().then(() => {
        // File deleted successfully
        console.log("3. image deleted from storage");
        alert("DELETE is completed!");
        location.reload();
    }).catch((error) => {
        // Uh-oh, an error occurred!
    });
}


function addPost() {
    window.location.href = "camera.html";
}