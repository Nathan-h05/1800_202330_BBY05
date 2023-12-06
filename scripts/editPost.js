// Extract the postId from the URL
let params = new URL( window.location.href ); //get URL of search bar
let postId = params.searchParams.get( "docID" ); //get value for key "id"
console.log( postId );


function populatePostsInfo() {
    firebase.auth().onAuthStateChanged(user => {

        db.collection("posts").doc(postId).get()
        .then(doc => {
            if (doc.exists) {
                let title = doc.data().name;
                let details = doc.data().details;
                let code = doc.data().code;
                let tags = doc.data().importance;
            
                    // Sets header as the title of post
                    if (title != null) {
                    document.getElementById("headerInput").innerText = title;
                    }
                    // If title is empty, header will be set to "Post"
                    if (title == "") {
                        document.getElementById("headerInput").innerText = "Post";
                    }
                    //if the data fields are not empty, then write them in to the form.
                    if (code != null) {
                        document.getElementById("codeInput").src = code;
                    }
                    if (title != null) {
                        document.getElementById("titleInput").value = title;
                    }
                    if (details != null) {
                        document.getElementById("detailsInput").value = details;
                    }
                    if (tags != null) {
                        document.getElementById("tagsInput").value = tags;
                    }
                }
                })
    });
}

//call the function to run it 
populatePostsInfo();



// edit button
function editPostsInfo() {
    //Enable the form fields
    document.getElementById('postsInfoFields').disabled = false; //for edit button!!
}

// save button
function savePostsInfo() {
    //enter code here

    //a) get user entered values
    title = document.getElementById('titleInput').value;       //get the value of the field with id="titleInput"
    details = document.getElementById('detailsInput').value;     //get the value of the field with id="detailsInput"
    tags = document.getElementById('tagsInput').value;       //get the value of the field with id="tagsInput"

    //b) update user's document in Firestore
    db.collection("posts").doc(postId).update({
        name: title,
        details: details,
        importance: tags
    })
        .then(() => {
            console.log("Document successfully updated!");
            window.location.href = "postsLibrary.html";
        })
    //c) disable edit 
    document.getElementById('postsInfoFields').disabled = true;
}
