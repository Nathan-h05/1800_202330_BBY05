
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
// function displayCardsDynamically(collection) {
//     let cardTemplate = document.getElementById("postCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

//     db.collection(collection).get()   
//     .where("userID", "==", user.uid)  // Filter by user ID
//                 .get()
//         .then(allPosts=> {
//             //var i = 1;  //Optional: if you want to have a unique ID for each hike
//             allPosts.forEach(doc => { //iterate thru each doc
//                 var title = doc.data().name;       // get value of the "name" key
//                 var details = doc.data().details;  // get value of the "details" key
//                 var code = doc.data().code;        // get value for the "code" key (picture)
//                 var tags = doc.data().importance;
// 								var postCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
//                 // var postLength = doc.data().length; //gets the length field
//                 let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

//                 var docID = doc.id; //grab the id for that hike doc.
                
//                 //update title and text and image
//                 newcard.querySelector('.card-title').innerHTML = title;
//                 // newcard.querySelector('.card-length').innerHTML = postLength +"km";
//                 newcard.querySelector('.card-text').innerHTML = details;
//                 newcard.querySelector('.card-tags').innerHTML = tags;
//                 let placeholder = "placeholder";
//                 //newcard.querySelector('.card-image').src = `./images/${placeholder}.jpg`; //Example: NV01.jpg
//                 newcard.querySelector('.card-image').src = code; //Example: NV01.jpg
//                 newcard.querySelector('a').href = "editPosts.html?docID="+docID; //Button / readmore.

//                 //Optional: give unique ids to all elements for future use
//                 // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
//                 // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
//                 // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

//                 //attach to gallery, Example: "hikes-go-here"
//                 document.getElementById(collection + "-go-here").appendChild(newcard);

//                 //i++;   //Optional: iterate variable to serve as unique ID
//             })
//         })
// }

// displayCardsDynamically("posts");  //input param is the name of the collection
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
                        var tags = doc.data().importance;
                        var docID = doc.id;

                        let newcard = cardTemplate.content.cloneNode(true);

                        newcard.querySelector('.card-title').innerHTML = title;
                        newcard.querySelector('.card-text').innerHTML = details;
                        newcard.querySelector('.card-tags').innerHTML = tags;
                        newcard.querySelector('.card-image').src = code;
                        newcard.querySelector('a').href = "editPosts.html?docID=" + docID;

                        document.getElementById(collection + "-go-here").appendChild(newcard);
                    })
                })
                .catch(error => {
                    console.error("Error getting documents: ", error);
                });
        }
    });
}

displayUserPosts("posts");
