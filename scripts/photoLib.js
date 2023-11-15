function writePosts() {
    //define a variable for the collection you want to create in Firestore to populate data
    var postRef = db.collection("posts");

    postRef.add({
        code: "https://firebasestorage.googleapis.com/v0/b/bby05-330cd.appspot.com/o/placeholder.jpg?alt=media&token=3e7ecb47-a4b4-4942-a890-1cc0036f8ad0",
        name: "Title of Incident from User0", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        importance: "Slight",
		details: "Slippery spot of black ice on popular park trail",
        location: "Burnaby Lake Regional Park",          //number value
        lat: 49.2467097082573,
        lng: -122.9187029619698,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    postRef.add({
        code: "https://firebasestorage.googleapis.com/v0/b/bby05-330cd.appspot.com/o/placeholder.jpg?alt=media&token=3e7ecb47-a4b4-4942-a890-1cc0036f8ad0",
        name: "Title of Incident from User1", //replace with your own city?
        city: "Anmore",
        province: "BC",
        importance: "Moderate",
        details: "Fire hydrant exploded, traffic backed up",
        location: "Anmore main road", 
        lat: 49.3399431028579,
        lng: -122.85908496766939,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    postRef.add({
        code: "https://firebasestorage.googleapis.com/v0/b/bby05-330cd.appspot.com/o/placeholder.jpg?alt=media&token=3e7ecb47-a4b4-4942-a890-1cc0036f8ad0",
        name: "Title of Incident from User2", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        importance: "Major",
        details:  "Police closed off Gastown area",
        location: "Gastown",
        lat: 49.38847101455571,
        lng: -122.94092543551031,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("postCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allPosts=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allPosts.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
                var code = doc.data().code;        // get value for the "code" key (picture)
                var tags = doc.data().importance;
								var postCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                // var postLength = doc.data().length; //gets the length field
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                // newcard.querySelector('.card-length').innerHTML = postLength +"km";
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-tags').innerHTML = tags;
                let placeholder = "placeholder";
                //newcard.querySelector('.card-image').src = `./images/${placeholder}.jpg`; //Example: NV01.jpg
                newcard.querySelector('.card-image').src = code; //Example: NV01.jpg

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("posts");  //input param is the name of the collection