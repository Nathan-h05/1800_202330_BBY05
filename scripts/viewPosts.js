


//Displays 1 card based on post clicked.
function displaySingleCardById(collection, postId) {
    let cardTemplate = document.getElementById("postCardTemplate");
    let singleCardContainer = document.getElementById(collection + "-go-here");

    db.collection(collection).doc(postId).get()
        .then(doc => {
            if (doc.exists) {
                let title = doc.data().name;
                let details = doc.data().details;
                let code = doc.data().code;
                let tags = doc.data().importance;
                let time = doc.data().last_updated;
                let date = time.toDate();
                let lat = doc.data().lat;
                let lng = doc.data().lng;
                // let location = GeoPoint(lat, lng)
                

                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-tags').innerHTML = tags;
                newcard.querySelector('.card-time').innerHTML = date;
                newcard.querySelector('.card-image').src = code;

                // newcard.querySelector('.card-location').innerHTML = city;

                singleCardContainer.appendChild(newcard);
            } else {
                console.log("No such document!");
            }
        })
        .catch(error => {
            console.error("Error getting document:", error);
        });
}

// Extract the postId from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Check if postId is present in the URL
if (postId) {
    displaySingleCardById("posts", postId);
} else {
    console.error("No post ID provided in the URL");
}