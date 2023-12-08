// Extract the postId from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Check if postId is present in the URL
if (postId) {
    displaySingleCardById("posts", postId);
} else {
    console.error("No post ID provided in the URL");
}

//Displays 1 card based on post clicked.
function displaySingleCardById(collection, postId) {
    let cardTemplate = document.getElementById("postCardTemplate");
    let singleCardContainer = document.getElementById(collection + "-go-here");
    let tags;
    db.collection(collection).doc(postId).get()
        .then(doc => {
            if (doc.exists) {
                let title = doc.data().name;
                let details = doc.data().details;
                let code = doc.data().code;
                tags = doc.data().importance;
                let time = doc.data().last_updated;
                let date = time.toDate();
                let lat = doc.data().lat;
                let lng = doc.data().lng;

                // Gets the user who uploaded the post
                let postUserID = doc.data().userID;
                db.collection('users').doc(postUserID).get()
                    .then(doc => {
                        let userName = doc.data().name;
                        document.getElementById("owner").innerText = userName;
                        document.getElementById("ownerHeader").innerText = userName;
                    })
                    .catch(error => {
                        console.error("Error getting document:", error);
                    })

                let newcard = cardTemplate.content.cloneNode(true);
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-tags').innerHTML = tags;
                newcard.querySelector('.card-time').innerHTML = date;
                newcard.querySelector('.card-image').src = code;
                singleCardContainer.appendChild(newcard);
            } else {
                console.log("No such document!");
            }
        }).then(() => {
            // Adds bootstrap colors to tags depending of value. Grabs div from html after card have been loaded
            function loadTagColors() {
                if (tags == "Low") {
                    var element = document.getElementById("tagColor");
                    element.classList.add("btn-success");
                }
                if (tags == "Medium") {
                    var element = document.getElementById("tagColor");
                    element.classList.add("btn-warning");
                }
                if (tags == "High") {
                    var element = document.getElementById("tagColor");
                    element.classList.add("btn-danger");
                }
                console.log("Loaded tag color");
            }
            loadTagColors(); // Runs function
        })
        .catch(error => {
            console.error("Error getting document:", error);
        });
}
